'use client';

export const LocalDate = ({ date }: { date: Date }) => {
  if (date)
    return <time suppressHydrationWarning>{date.toLocaleDateString()}</time>;
  return null;
};
