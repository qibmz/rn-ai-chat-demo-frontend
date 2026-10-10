import Logo from '@/assets/icons/Logo';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React from 'react';

export default function Home() {
  return (
    <Box className="bg-background flex-1">
      <Center className="flex-1 gap-5">
        <Logo />
        <Text className="font-semibold">
          Get started by editing <Text className="text-primary/70">app/index.tsx</Text>
        </Text>
      </Center>
    </Box>
  );
}
