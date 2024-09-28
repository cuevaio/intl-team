'use client';

import React from 'react';

import { CategoryCombobox } from '../links/category-combobox';

export default function Page() {
  const [a, sA] = React.useState<string | undefined>();
  return <CategoryCombobox selected={a} setSelected={sA} />;
}
