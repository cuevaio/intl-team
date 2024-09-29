'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import { logout } from './logout.action';

export const Logout = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.get('hello');
      const result = await logout();

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      router.push('/signin');
    },
  });

  return (
    <form action={mutate}>
      <Button disabled={isPending}>Logout</Button>
    </form>
  );
};
