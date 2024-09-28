'use client';

import { useMutation } from '@tanstack/react-query';
import { CircleHelpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create link</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={mutate}>
          <DialogHeader>
            <DialogTitle>Create link</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="url">
                Destination URL
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" className="size-4">
                      <CircleHelpIcon className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-[200px]">
                    <p>The URL to redirect to when visiting your short link.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="url"
                name="url"
                type="url"
                required
                disabled={isPending}
                placeholder="https://confluence.powercosts.com/display/HR/Human+Resources+Home"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="key">Short Link</Label>
              <div className="flex">
                <Button
                  variant="outline"
                  className="z-[0] rounded-r-none border-r-0 tracking-wide"
                  type="button"
                  disabled
                >
                  intl.team/l
                </Button>
                <Input
                  id="key"
                  name="key"
                  type="text"
                  required
                  disabled={isPending}
                  className="z-[1] rounded-l-none tracking-wide"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="mt-4 w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
