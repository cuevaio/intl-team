'use client';

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

import { createLink } from './create-link.action';

export const CreateLinkForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createLink(formData);

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <form action={mutate}>
      <Card>
        <CardHeader>
          <CardTitle>Add link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="url">Url</Label>
              <Input
                id="url"
                name="url"
                type="url"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                name="key"
                type="text"
                required
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
