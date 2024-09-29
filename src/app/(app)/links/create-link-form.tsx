'use client';

import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { CircleHelpIcon, ShuffleIcon } from 'lucide-react';

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

import { randomLinkKey } from '@/lib/nanoid';

import { CategoryCombobox } from './category-combobox';
import { createLink } from './create-link.action';

export const CreateLinkForm = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setKey(undefined);
    setCategory(undefined);
  }, [setKey, open]);

  React.useEffect(() => {
    if (open) return;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'c' || event.key === 'C') {
        event.preventDefault(); // Prevent the 'C' from being typed
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [open]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (category) {
        formData.append('category', category);
      }
      const result = await createLink(formData);

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      setOpen(false);
    },
  });

  const setRandomKey: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(() => {
      const randomKey = randomLinkKey();
      setKey(randomKey);
    }, [setKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create link
          <div className="ml-2 size-4 rounded bg-muted text-xs text-primary">
            C
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={mutate}>
          <DialogHeader>
            <DialogTitle>Create link</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="space-y-2">
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
                type="text"
                required
                disabled={isPending}
                placeholder="https://confluence.powercosts.com/display/HR/Human+Resources+Home"
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="key">Short Link</Label>
                <Button
                  onClick={setRandomKey}
                  size="icon"
                  variant="ghost"
                  className="size-5"
                  type="button"
                >
                  <ShuffleIcon className="size-3" />
                </Button>
              </div>
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
                  disabled={isPending}
                  className="z-[1] rounded-l-none tracking-wide"
                  autoComplete="off"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="(optional)"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
              <CategoryCombobox selected={category} setSelected={setCategory} />
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
