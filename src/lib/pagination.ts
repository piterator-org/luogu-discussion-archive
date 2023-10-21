const RADIUS_PAGES_LOCAL_SHOWED = parseInt(
  process.env.RADIUS_PAGES_LOCAL_SHOWED ?? "2",
  10,
);

export default function paginate(numPages: number, curPage: number) {
  const numPagesLocalOverlappedFront = Math.max(
    0,
    2 - (curPage - RADIUS_PAGES_LOCAL_SHOWED),
  );
  const numPagesLocalOverlappedBack = Math.max(
    0,
    curPage +
      RADIUS_PAGES_LOCAL_SHOWED +
      numPagesLocalOverlappedFront -
      (numPages - 1),
  );
  const pageLocalFirst = Math.max(
    2,
    curPage - RADIUS_PAGES_LOCAL_SHOWED - numPagesLocalOverlappedBack,
  );
  const pageLocalLast = Math.min(
    numPages - 1,
    curPage + RADIUS_PAGES_LOCAL_SHOWED + numPagesLocalOverlappedFront,
  );
  const pagesLocalAttachedFront = pageLocalFirst === 2;
  const pagesLocalAttachedBack = pageLocalLast === numPages - 1;
  const pagesLocal = Array.from(
    { length: pageLocalLast - pageLocalFirst + 1 },
    (_, k) => k + pageLocalFirst,
  );
  return { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal };
}
