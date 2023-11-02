export function NotPlaying({
  text = 'Not currently listening',
}: {
  text: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row items-center justify-center space-x-2">
        <slot />
        <div className="flex flex-col">
          <h4 className="text-xs text-neutral-500">{text}</h4>
        </div>
      </div>
    </div>
  );
}
