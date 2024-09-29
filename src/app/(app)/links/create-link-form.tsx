'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useKeyPress } from '@/hooks/use-key-press';
import { useMutation } from '@tanstack/react-query';
import { CircleHelpIcon, ShuffleIcon } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'usehooks-ts';

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
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KeyHint } from '@/components/key-hint';

import { randomLinkKey } from '@/lib/nanoid';

import { CategoryCombobox } from './category-combobox';
import { createLink } from './create-link.action';

export const CreateLinkForm = () => {
  const { width = 0, height = 0 } = useWindowSize();

  const [showConfetti, setShowConfetti] = React.useState(false);

  const [open, setOpen] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);

  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setKey(undefined);
    setCategory(undefined);
  }, [setKey, open]);

  useKeyPress('c', () => setOpen(true));

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (category) {
        formData.append('category', category);
      }
      const result = await createLink(formData);

      if (!result.success) throw new Error(result.error);

      return result.data;
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: async ({ isPublic }) => {
      if (!isPublic) {
        router.push('/links/personal');
      }
      setOpen(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    },
  });

  const setRandomKey: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(() => {
      const randomKey = randomLinkKey();
      setKey(randomKey);
    }, [setKey]);

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={1000}
          initialVelocityY={50}
          initialVelocityX={5}
          width={width * 0.95}
          height={height * 0.95}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            Create link
            <KeyHint hint="C" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form action={mutate}>
            <DialogHeader>
              <DialogTitle>Create link</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid grid-cols-1 gap-6">
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
                      <p>
                        The URL to redirect to when visiting your short link.
                      </p>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label>Category</Label>
                  <CategoryCombobox
                    selected={category}
                    setSelected={setCategory}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    name="public"
                    defaultChecked={pathname === '/links'}
                  />
                  <Label htmlFor="public">Public</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Turn this off if you want to keep your link private
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="mt-4 w-full">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
