'use client';

import {
    Button,
    Flex,
    FloatingPanel,
    Icon,
    ImageCarouselController,
    InfoCard,
    InputImage,
    InputMultipleSelect,
    InputText,
    InputTextArea,
    Modal,
    Select,
    Text,
} from '@/components/common';
import {
    ISpotExtended,
    SPOT_PERIODS,
    TSpot,
    TSpotInsert,
    TSpotUpdate,
    updateSpot,
} from '@/features/spots';
import {
    SPOT_DIFFICULTIES,
    SPOT_ORIENTATIONS,
    SPOT_TYPES,
} from '@/features/spots/constants';
import useCustomForm from '@/features/spots/hooks';
import { deleteFiles, uploadFiles } from '@/features/storage';
import { useToggle } from '@/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useDictionary } from '../DictionaryProvider';
import { useSupabase } from '../auth/SupabaseProvider';

export type SpotUpdatePanelProps = {
  onSpotUpdated?: (spot: TSpot) => void;
  onClose?: () => void;
  initialSpot: ISpotExtended;
  initialPanelState?: boolean;
  showButton?: boolean;
};

export function SpotUpdatePanel({
  onSpotUpdated,
  onClose,
  initialSpot,
  initialPanelState = false,
  showButton = true,
}: SpotUpdatePanelProps) {
  const dictionary = useDictionary();
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [panelOpen, openPanel, closePanel] = useToggle(initialPanelState);

  const initialState: TSpotInsert | ISpotExtended = initialSpot || {
    name: '',
    description: undefined,
    approach: undefined,
    difficulty: 'Medium',
    rock_type: undefined,
    cliff_height: undefined,
    period: undefined,
    orientation: undefined,
    image: [],
    creator: '',
    type: 'Indoor',
  };

  const [spotForm, setSpotForm, errors, setErrors] =
    useCustomForm(initialState);
  const [images, setImages] = useState<File[]>([]);

  const [submittingMessage, setSubmittingMessage] = useState<
    string | undefined
  >(undefined);

  const [confirmModalOpen, openConfirmModal, closeConfirmModal] =
    useToggle(false);

  const allOptionalFieldsFilled = useMemo(() => {
    const optionalFields = [
      spotForm.description,
      spotForm.approach,
      spotForm.rock_type,
      spotForm.cliff_height,
      spotForm.period,
      spotForm.orientation,
    ];

    return optionalFields.every((field) => field !== undefined);
  }, [spotForm]);

  const allRequiredFieldsFilled = useMemo(() => {
    const requiredFields = [
      spotForm.name !== '',
      spotForm.difficulty !== null,
      spotForm.type !== null,
      location !== null || initialSpot.location !== null,
      images !== null,
    ];

    return requiredFields.every((field) => field === true);
  }, [spotForm, location, images]);

  const fieldsUpdated: { name: string; initialValue: any; newValue: any }[] =
    useMemo(() => {
      const fields = [
        {
          name: 'name',
          initialValue: initialSpot.name,
          newValue: spotForm.name,
        },
        {
          name: 'description',
          initialValue: initialSpot.description,
          newValue: spotForm.description,
        },
        {
          name: 'approach',
          initialValue: initialSpot.approach,
          newValue: spotForm.approach,
        },
        {
          name: 'difficulty',
          initialValue: initialSpot.difficulty,
          newValue: spotForm.difficulty,
        },
        {
          name: 'rock_type',
          initialValue: initialSpot.rock_type,
          newValue: spotForm.rock_type,
        },
        {
          name: 'cliff_height',
          initialValue: initialSpot.cliff_height,
          newValue: spotForm.cliff_height,
        },
        {
          name: 'period',
          initialValue: initialSpot.period,
          newValue: spotForm.period,
        },
        {
          name: 'orientation',
          initialValue: initialSpot.orientation,
          newValue: spotForm.orientation,
        },
        {
          name: 'image',
          initialValue: initialSpot.image,
          newValue: [
            ...(spotForm.image as string[]),
            ...images.map((image) => URL.createObjectURL(image)),
          ],
        },
        {
          name: 'creator',
          initialValue: initialSpot.creator,
          newValue: spotForm.creator,
        },
        {
          name: 'city',
          initialValue: initialSpot.location.city,
          newValue: location?.city,
        },
        {
          name: 'department',
          initialValue: initialSpot.location.department,
          newValue: location?.department,
        },
        {
          name: 'country',
          initialValue: initialSpot.location.country,
          newValue: location?.country,
        },
        {
          name: 'latitude',
          initialValue: initialSpot.location.latitude,
          newValue: location?.latitude,
        },
        {
          name: 'longitude',
          initialValue: initialSpot.location.longitude,
          newValue: location?.longitude,
        },
        {
          name: 'type',
          initialValue: initialSpot.type,
          newValue: spotForm.type,
        },
      ];

      return fields.filter((field) =>
        field.name === 'image'
          ? images.length > 0 || spotForm.image !== initialSpot.image
          : field.newValue !== undefined &&
            field.initialValue !== field.newValue,
      );
    }, [spotForm, location, images]);

  const handleFileUpload = async (files: File[]) => {
    const imagesPaths = await uploadFiles({
      client: supabase,
      path: 'spots',
      files: files,
    });

    setSpotForm.image &&
      setSpotForm.image(imagesPaths.map((image) => image.publicUrl));

    return imagesPaths;
  };
  const handleDeleteImages = async (imagesPaths: string[]) => {
    const response = await deleteFiles({
      client: supabase,
      files: imagesPaths,
    });

    return response;
  };

  const handleSpotUpdate = async (spot: TSpotUpdate) => {
    const { spot: spotUpdated, error } = await updateSpot({
      client: supabase,
      spot: spot,
    });

    if (error) {
      throw new Error(error.message);
    }

    return spotUpdated;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a spot');
      return false;
    }

    setSubmittingMessage(`${dictionary.spotsCreation.checking_data}...`);

    if (fieldsUpdated.length === 0) {
      toast.error('No fields updated');
      setSubmittingMessage(undefined);
      return false;
    }

    let publicImagesPaths: string[] = [];
    let imagesPaths: string[] = [];

    /* 
      UPLOAD IMAGES
    */
    if (images.length > 0) {
      setSubmittingMessage(`${dictionary.spotsCreation.uploading_images}...`);
      try {
        const responses = await handleFileUpload(images);
        publicImagesPaths = responses.map((response) => response.publicUrl);
        imagesPaths = responses.map((response) => response.path);
      } catch (error) {
        logger.error(error);
        toast.error(dictionary.spotsCreation.error_uploading_images);
        setSubmittingMessage(undefined);
        return false;
      }
    }

    /*
    UPDATE SPOT
    */

    setSubmittingMessage(`${dictionary.spotsCreation.creating_spot}...`);
    try {
      const spotUpdated = await handleSpotUpdate({
        id: initialSpot.id as string,
        description: spotForm.description,
        approach: spotForm.approach,
        difficulty: spotForm.difficulty || undefined,
        type: spotForm.type || undefined,
        rock_type: spotForm.rock_type,
        cliff_height: spotForm.cliff_height,
        period: spotForm.period,
        orientation: spotForm.orientation,
        image: [...(spotForm.image as string[]), ...publicImagesPaths],
      });
      if (!spotUpdated) {
        toast.error(dictionary.spotsCreation.error_creating_spot);
        throw new Error(dictionary.spotsCreation.error_creating_spot);
      }
      logger.info('Spot updated', spotUpdated);
      onSpotUpdated && onSpotUpdated(spotUpdated);
      setSubmittingMessage(undefined);
      return true;
    } catch (error) {
      logger.error(error);
      toast.error(dictionary.spotsCreation.error_creating_spot);
      publicImagesPaths.length > 0 && handleDeleteImages(imagesPaths);
      setSubmittingMessage(undefined);
      return false;
    }
  };

  return (
    <>
      {showButton && (
        <Button
          text={dictionary.spots.update_spot}
          icon="models"
          variant="default"
          onClick={() => openPanel()}
        />
      )}
      {panelOpen && (
        <FloatingPanel
          isOpen={panelOpen}
          title={dictionary.spots.update_spot}
          onClose={() => {
            closePanel();
            onClose && onClose();
          }}
          size="large"
          onConfirm={async () => {
            openConfirmModal();
          }}
          forceValidation={true}
          forceValidationMessage={dictionary.common.force_validation_message}
        >
          <Flex
            fullSize
            direction="column"
            horizontalAlign="left"
            gap={0}
            className="divide-y overflow-y-auto divide-white-300 dark:divide-dark-300"
          >
            {submittingMessage && (
              <Flex
                fullSize
                className="absolute inset-0 z-50 bg-white-200 dark:bg-dark-100 bg-opacity-70 dark:bg-opacity-70"
                direction="column"
                horizontalAlign="center"
                verticalAlign="center"
                gap={6}
              >
                <Icon name="spin" className="animate-spin" />
                <Text variant="body">{submittingMessage}</Text>
              </Flex>
            )}
            <Flex
              className="w-full p-6"
              direction="column"
              horizontalAlign="left"
              verticalAlign="top"
              gap={6}
            >
              <Text variant="body" className="py-0 px-3">
                {dictionary.common.required_fields}
              </Text>
              <InputText
                labelText={dictionary.spots.spot_name}
                type="text"
                error={errors.name}
                value={spotForm.name}
                disabled
                onChange={(e) => {
                  setSpotForm.name(e.target.value);
                  setErrors({ name: undefined });
                }}
                className="w-full"
              />
              <Flex className="w-full" direction="row" gap={6}>
                <Select
                  labelText={dictionary.common.difficulty}
                  className="h-full w-full"
                  icon="chart"
                  value={spotForm.difficulty}
                  onChange={(e) =>
                    setSpotForm.difficulty(
                      e.target.value as typeof spotForm.difficulty,
                    )
                  }
                >
                  {Object.values(SPOT_DIFFICULTIES).map((difficulty) => (
                    <option value={difficulty} key={difficulty}>
                      {dictionary.spots.difficulty[difficulty]}
                    </option>
                  ))}
                </Select>
                <Select
                  labelText={dictionary.common.type}
                  className="h-full w-full"
                  icon="globe-alt"
                  value={spotForm.type}
                  onChange={(e) =>
                    setSpotForm.type(e.target.value as typeof spotForm.type)
                  }
                >
                  {Object.values(SPOT_TYPES).map((type) => (
                    <option value={type} key={type}>
                      {dictionary.spots.type[type]}
                    </option>
                  ))}
                </Select>
              </Flex>

              <InputImage
                labelText={dictionary.spots.spot_images}
                error={errors.image}
                initialImages={spotForm.image || []}
                onDeleteInitialImage={(image) => {
                  setSpotForm.image &&
                    setSpotForm.image(
                      spotForm.image.filter((i) => i !== image),
                    );
                }}
                onDeleteImagesButtonClicked={() => {
                  setSpotForm.image && setSpotForm.image([]);
                }}
                onResetButtonClicked={() => {
                  setSpotForm.image && setSpotForm.image(initialSpot.image);
                }}
                onSelectedFilesChange={(images) => {
                  setImages(images);
                  setErrors({ image: undefined });
                }}
              />
            </Flex>
            <Flex
              className="w-full p-6"
              direction="column"
              horizontalAlign="left"
              verticalAlign="top"
              gap={6}
            >
              <Text variant="body" className="py-0 px-3">
                {dictionary.common.optional_fields}
              </Text>
              <InputTextArea
                labelText={dictionary.spots.spot_description}
                type="text"
                value={spotForm.description || ''}
                onChange={(e) =>
                  setSpotForm.description &&
                  setSpotForm.description(e.target.value)
                }
                className="w-full"
              />
              <InputTextArea
                labelText={dictionary.common.approach}
                type="text"
                value={spotForm.approach || ''}
                onChange={(e) =>
                  setSpotForm.approach && setSpotForm.approach(e.target.value)
                }
                className="w-full"
              />
              <Flex className="w-full" direction="row" gap={6}>
                <InputText
                  labelText={dictionary.spots.rock_type}
                  type="text"
                  value={spotForm.rock_type || ''}
                  onChange={(e) =>
                    setSpotForm.rock_type &&
                    setSpotForm.rock_type(e.target.value)
                  }
                  className="w-full"
                />
                <InputText
                  labelText={`${dictionary.common.cliff_height} (m)`}
                  type="number"
                  value={spotForm.cliff_height || 0}
                  onChange={(e) =>
                    setSpotForm.cliff_height &&
                    setSpotForm.cliff_height(parseInt(e.target.value))
                  }
                  className="w-full"
                />
                <Select
                  labelText={dictionary.common.orientation}
                  className="h-full w-full"
                  value={spotForm.orientation}
                  onChange={(e) =>
                    setSpotForm.orientation &&
                    setSpotForm.orientation([e.target.value])
                  }
                >
                  {Object.values(SPOT_ORIENTATIONS).map((orientation) => (
                    <option value={orientation} key={orientation}>
                      {orientation}
                    </option>
                  ))}
                </Select>
              </Flex>
              <InputMultipleSelect
                labelText={dictionary.common.practice_period}
                onChange={(selectedItems) => {
                  setSpotForm.period && setSpotForm.period(selectedItems);
                }}
                initialSelectedOptions={spotForm?.period?.map(
                  (period) => dictionary.month[period.toLocaleLowerCase()],
                )}
                options={Object.values(SPOT_PERIODS).map(
                  (period) => dictionary.month[period.toLocaleLowerCase()],
                )}
              />
            </Flex>
          </Flex>
          <Modal
            title={dictionary.common.one_more_step}
            isOpen={confirmModalOpen}
            size="xlarge"
            fullHeight
            onClose={() => closeConfirmModal()}
            onConfirm={async () => {
              closeConfirmModal();
              if (await handleSubmit()) {
                router.refresh();
                closePanel();
              }
            }}
          >
            <Flex className="w-full p-3" horizontalAlign="left">
              {!allRequiredFieldsFilled ? (
                <InfoCard
                  message={dictionary.common.must_fill_required_fields}
                  color="red"
                  icon="warning"
                >
                  {Object.entries({
                    name: spotForm.name,
                    difficulty: spotForm.difficulty,
                    type: spotForm.type,
                    location: location,
                    image: images,
                  }).map(([key, value]) => {
                    if (
                      value === undefined ||
                      value === '' ||
                      value?.length === 0 ||
                      value === null
                    ) {
                      return (
                        <Text
                          variant="caption"
                          key={key}
                          className="opacity-60"
                        >
                          {key}
                        </Text>
                      );
                    }
                  })}
                </InfoCard>
              ) : null}
              {!allOptionalFieldsFilled ? (
                <InfoCard
                  message={dictionary.common.warning_fill_optional_fields}
                  color="warning"
                  icon="warning"
                >
                  {Object.entries(spotForm).map(([key, value]) => {
                    if (value === undefined) {
                      return (
                        <Text
                          variant="caption"
                          key={key}
                          className="opacity-60"
                        >
                          {key}
                        </Text>
                      );
                    }
                  })}
                </InfoCard>
              ) : null}
              {fieldsUpdated.length > 0 && (
                <InfoCard
                  message={'You did some changes, please confirm them'}
                  color="warning"
                  icon="warning"
                  className="w-full"
                >
                  {fieldsUpdated.map((field) =>
                    field.name !== 'image' ? (
                      <Flex direction="row" gap={2} key={field.name}>
                        <Text variant="caption" className="opacity-90">
                          {field.name}
                        </Text>
                        <Text
                          variant="caption"
                          className="opacity-60 line-through"
                        >
                          {Array.isArray(field.initialValue)
                            ? field.initialValue.join(', ')
                            : field.initialValue}
                        </Text>
                        <Icon
                          name="arrow-right"
                          className="opacity-90"
                          scale={0.6}
                        />
                        <Text variant="caption" className="opacity-60">
                          {Array.isArray(field.newValue)
                            ? field.newValue.join(', ')
                            : field.newValue}
                        </Text>
                      </Flex>
                    ) : (
                      <Flex
                        direction="column"
                        verticalAlign="top"
                        horizontalAlign="left"
                        className="w-full"
                        gap={2}
                        key={field.name}
                      >
                        <Text variant="caption" className="opacity-90">
                          Old images
                        </Text>
                        <ImageCarouselController
                          images={field.initialValue.map((image) => ({
                            src: image,
                            alt: 'spot image',
                          }))}
                          imageWidth="medium"
                          height={100}
                        />
                        <Flex className="w-full" gap={2}>
                          <Icon
                            name="chevron-down"
                            className="opacity-90"
                            scale={0.6}
                          />
                        </Flex>
                        <Text variant="caption" className="opacity-90">
                          New images
                        </Text>
                        {field.newValue.length > 0 ? (
                          <ImageCarouselController
                            images={field.newValue.map((image) => ({
                              src: image,
                              alt: 'spot image',
                            }))}
                            imageWidth="medium"
                            height={100}
                          />
                        ) : (
                          <Text variant="caption" className="opacity-60">
                            {dictionary.common.no_image}
                          </Text>
                        )}
                      </Flex>
                    ),
                  )}
                </InfoCard>
              )}
              <Text variant="body" className="py-0 px-3">
                {dictionary.common.check_before_submit}
              </Text>
            </Flex>
          </Modal>
        </FloatingPanel>
      )}
    </>
  );
}
