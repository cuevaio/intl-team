import { cn } from '@/lib/utils';

export const KeyHint = ({
  hint,
  className,
}: {
  hint: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'ml-2 size-4 rounded bg-muted text-center text-xs text-primary',
        className,
      )}
    >
      {hint.toUpperCase()}
    </div>
  );
};
