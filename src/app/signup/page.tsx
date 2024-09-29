'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signup } from './signup.action';

export default function Page() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await signup(formData);

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      router.push('/');
    },
  });
  return (
    <div className="container mx-auto my-5">
      <Card className="w-[300px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sign up</CardTitle>
            <Link
              href="/signin"
              className="text-xs text-muted-foreground underline"
            >
              or sign in
            </Link>
          </div>{' '}
        </CardHeader>
        <form action={mutate}>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input disabled={isPending} name="username" id="username" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  disabled={isPending}
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isPending}>Continue</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
