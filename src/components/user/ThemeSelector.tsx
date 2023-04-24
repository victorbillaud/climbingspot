import { useTheme } from 'next-themes';
import { Flex, Icon, IconNames, Select, Text } from '../common';

const themeIcon: Record<string, IconNames> = {
  light: 'sun',
  dark: 'moon',
  system: 'eye',
};

export const ThemeSelector = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Flex
      fullSize
      className="divide-y divide-white-300 dark:divide-dark-300"
      verticalAlign="top"
      gap={0}
    >
      <Flex fullSize verticalAlign="center" className="p-3" direction="row">
        <Icon name="eye" />
        <Text variant="h4" weight={400} className="w-full opacity-80">
          Theme
        </Text>
      </Flex>
      <Flex fullSize verticalAlign="top" className="p-3">
        <Select
          value={theme}
          onChange={(e) => {
            e.preventDefault();
            setTheme(e.target.value);
          }}
          className="w-1/4 mx-2"
          icon={themeIcon[theme || 'eye']}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </Select>
      </Flex>
    </Flex>
  );
};
