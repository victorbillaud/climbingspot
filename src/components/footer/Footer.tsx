import { Flex } from '../common';
import { PayPalDonateButton } from '../PayPalDonateButton';
import LocaleSwitcher from './LocaleSwitcher';

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-white-100 dark:bg-dark-200 border-y border-white-300 dark:border-dark-300 py-3">
      <Flex fullSize>
        <LocaleSwitcher />
        <PayPalDonateButton />
      </Flex>
    </footer>
  );
}
