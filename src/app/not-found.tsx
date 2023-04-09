import { Flex, Text } from '@/components/common';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Flex fullSize>
      <Image src="/logo_clear.png" alt="Logo" width={100} height={100} />
      <Text variant="title">404</Text>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        <Text variant="body" className="hover:text-brand-600">
          Go back home
        </Text>
      </Link>
    </Flex>
  );
}
