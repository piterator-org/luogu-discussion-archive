import InfiniteScroll from "./InfiniteScroll";

export default function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  return <InfiniteScroll id={id} />;
}
