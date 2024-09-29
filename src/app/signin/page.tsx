'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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

import { signin } from './signin.action';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await signin(formData);

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      const after = searchParams.get('after');
      if (after) {
        // TODO: Validate that after is a valid pathname
        router.push(after);
      } else {
        router.push('/');
      }
    },
  });
  return (
    <div className="container mx-auto my-5">
      <Card className="w-[300px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sign in</CardTitle>
            <Link
              href="/signup"
              className="text-xs text-muted-foreground underline"
            >
              or sign up
            </Link>
          </div>
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
