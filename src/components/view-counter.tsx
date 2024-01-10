export default function ViewCounter({
  viewsForSlug,
}: {
  viewsForSlug?: {
    count: number;
  };
}) {
  const number = new Number(viewsForSlug?.count || 0);

  return (
    <p className="font-medium text-neutral-400">{`${number.toLocaleString()} views`}</p>
  );
}
