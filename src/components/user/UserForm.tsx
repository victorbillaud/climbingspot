import { Button, Card, Flex, Icon, InputText, Text } from '@/components/common';
import useCustomForm from '@/features/spots/hooks';
import { Database } from '@/lib/db_types';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';

type userFormProps = {
  user: Database['public']['Tables']['profiles']['Update'] & {
    email: string;
  };
};

export const UserForm = ({ user }: userFormProps) => {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [form, setForm, error, setError] = useCustomForm({
    full_name: user.full_name,
    username: user.username,
  });
  const handleUpdate = async () => {
    const { error: err, data } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        username: form.username,
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (data) {
      toast.success('Profile updated');
      router.refresh();
      return;
    }

    if (err) {
      toast.error(err.message);
      return;
    }
  };

  const updateDetected = useMemo(() => {
    return form.full_name !== user.full_name || form.username !== user.username;
  }, [form, user]);

  return (
    <Card className="w-full">
      <Flex
        fullSize
        className="divide-y divide-white-300 dark:divide-dark-300"
        verticalAlign="top"
        gap={0}
      >
        <Flex
          fullSize
          verticalAlign="center"
          horizontalAlign="stretch"
          className="px-3 py-2"
          direction="row"
        >
          <Flex direction="row" horizontalAlign="center">
            <Icon name="user-circle" />
            <Text variant="h4" weight={400} className="w-full opacity-80">
              Profile
            </Text>
          </Flex>
          <Button
            variant="default"
            text="Update"
            onClick={handleUpdate}
            disabled={!updateDetected}
          />
        </Flex>
        <Flex fullSize verticalAlign="top" className="p-3">
          <table className="w-1/2 border-separate border-spacing-2">
            <tbody>
              <tr className="h-10">
                <td className="w-32">
                  <Text variant="body">Email</Text>
                </td>
                <td>
                  <InputText
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={() => {}}
                    disabled
                    className="ml-2"
                  />
                </td>
              </tr>
              <tr className="h-10">
                <td className="w-32">
                  <Text variant="body">Full name</Text>
                </td>
                <td>
                  <InputText
                    type="text"
                    placeholder="Full name"
                    value={form.full_name}
                    onChange={(e) => setForm.full_name(e.target.value)}
                    className="ml-2"
                  />
                </td>
              </tr>
              <tr className="h-10">
                <td className="w-32">
                  <Text variant="body">Username</Text>
                </td>
                <td>
                  <InputText
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm.username(e.target.value)}
                    className="ml-2"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Flex>
      </Flex>
    </Card>
  );
};
