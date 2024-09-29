'use client';

import React from 'react';

import { useSearchOptionsStore } from '@/providers/search-options-provider';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const SearchOptions = () => {
  const { searchBy, setSearchBy } = useSearchOptionsStore((state) => state);

  return (
    <div className="mb-4">
      <div>
        <div className="mb-1 text-sm font-bold">Search by</div>
        <RadioGroup
          value={searchBy}
          onValueChange={(v) => void setSearchBy(v as 'url' | 'key')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url" className="text-sm">
              Destination URL
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="key" id="key" />
            <Label htmlFor="key" className="text-sm">
              Short Link
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
