import { cn } from '@/lib/utils';

const backgroundColors = {
  a: 'bg-blue-700',
  b: 'bg-indigo-700',
  c: 'bg-purple-700',
  d: 'bg-pink-700',
  e: 'bg-red-700',
  f: 'bg-orange-700',
  g: 'bg-amber-700',
  h: 'bg-yellow-600',
  i: 'bg-lime-700',
  j: 'bg-green-700',
  k: 'bg-emerald-700',
  l: 'bg-teal-700',
  m: 'bg-cyan-700',
  n: 'bg-sky-700',
  o: 'bg-blue-800',
  p: 'bg-indigo-800',
  q: 'bg-purple-800',
  r: 'bg-pink-800',
  s: 'bg-red-800',
  t: 'bg-orange-800',
  u: 'bg-amber-800',
  v: 'bg-lime-800',
  w: 'bg-green-800',
  x: 'bg-teal-800',
  y: 'bg-cyan-800',
  z: 'bg-sky-800',
} as const;

type Letters = keyof typeof backgroundColors;

export const Avatar = ({ username }: { username: string }) => {
  const avatar = username[0];
  return (
    <div
      className={cn(
        'flex size-6 flex-none items-center justify-center rounded-full text-xs font-bold text-foreground',
        backgroundColors[avatar.toLowerCase() as Letters],
      )}
    >
      {avatar.toUpperCase()}
    </div>
  );
};
