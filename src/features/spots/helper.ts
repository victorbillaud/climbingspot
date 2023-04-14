// create a function that receives an array of images and returns an array of File objects
export const createFiles = async (images: string[]) => {
  const files: File[] = [];

  const fetchImageAsBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.statusText}`);
    }
    return await response.blob();
  };

  for (const imageUrl of images) {
    try {
      const imageData = await fetchImageAsBlob(imageUrl);
      const file = new File([imageData], 'image.png', { type: imageData.type });
      files.push(file);
    } catch (error) {
      console.error(`Failed to create File object for ${imageUrl}:`, error);
    }
  }

  return files;
};
