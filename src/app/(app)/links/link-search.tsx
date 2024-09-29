'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { useKeyPress } from '@/hooks/use-key-press';

import { Input } from '@/components/ui/input';
import { KeyHint } from '@/components/key-hint';

export const LinkSearch = () => {
  const router = useRouter();

  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const search = formData.get('search');
    if (search) {
      router.push(`/links/search?query=${search}`);
    }
  }

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useKeyPress('s', () => inputRef.current?.focus());

  return (
    <form className="relative grow" onSubmit={submitHandler}>
      <Input placeholder="Search something..." name="search" ref={inputRef} />
      <KeyHint hint="S" className="absolute right-3 top-2.5" />
    </form>
  );
};
