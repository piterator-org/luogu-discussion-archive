import Link from "next/link";

export default function PageButton({
  discussion,
  page,
  active,
}: {
  discussion: number;
  page: number;
  // eslint-disable-next-line react/require-default-props
  active?: number;
}) {
  return page === active ? (
    <button
      type="button"
      className="btn btn-primary btn-sm shadow-sm border-0 mx-1 my-1"
      disabled
    >
      {page}
    </button>
  ) : (
    <Link
      className="btn btn-light btn-sm shadow-sm border-0 text-secondary mx-1 my-1"
      href={`/${discussion}/${page}`}
    >
      {page}
    </Link>
  );
}
