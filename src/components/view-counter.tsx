export default function ViewCounter({
  viewsForSlug,
}: {
  viewsForSlug?: {
    count: number;
  };
}) {
  const number = new Number(viewsForSlug?.count || 0);

  return <p>{`${number.toLocaleString()} views`}</p>;
}
