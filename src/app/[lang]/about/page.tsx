import { Flex, Text } from '@/components/common';
import Link from 'next/link';

export default function Page() {
  return (
    <Flex
      direction="column"
      gap={4}
      horizontalAlign="left"
      verticalAlign="start"
      className="px-4 py-8 w-full max-w-4xl mx-auto"
    >
      <Text variant="h1">About me</Text>
      <Text variant="body">
        My name is Victor and I am a software developer. I am passionate about
        climbing and I wanted to create a platform for climbers to connect with
        each other.
      </Text>

      <Text variant="h2">Utilisation des spots d'escalade</Text>
      <Text variant="body">
        Climbing Spot is a social platform for climbers to share their climbing
        experiences and find new climbing partners. It is a place to find new
        climbing spots and to share your favorite climbing spots with others.
      </Text>

      <Text variant="body">
        If you have any questions or feedback, feel free to contact me at
      </Text>
      <Link href="mailto:contact@climbingspot.eu">
        <Text variant="body" className="text-brand-500">
          contact@climbingspot.eu
        </Text>
      </Link>
      <Link href="/policy">
        <Text variant="caption">Privacy Policy</Text>
      </Link>
    </Flex>
  );
}
