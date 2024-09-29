'use client';

import { useRouter } from 'next/navigation';

import { useKeyPress } from '@/hooks/use-key-press';

export const KeyMappings = () => {
  const router = useRouter();
  useKeyPress('l', () => router.push('/links'));
  useKeyPress('p', () => router.push('/links/personal'));

  return null;
};
