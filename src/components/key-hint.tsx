export const KeyHint = ({ hint }: { hint: string }) => {
  return (
    <div className="ml-2 size-4 rounded bg-muted text-center text-xs text-primary">
      {hint.toUpperCase()}
    </div>
  );
};
