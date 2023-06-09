import PageButton from "./PageButton";

export default function PageButtons({
  ellipsisFront,
  ellipsisBack,
  numPages,
  pagesLocal,
  generatorUrl,
  active,
}: {
  ellipsisFront: boolean;
  ellipsisBack: boolean;
  numPages: number;
  pagesLocal: number[];
  generatorUrl: (curPage: number) => string;
  // eslint-disable-next-line react/require-default-props
  active?: number;
}) {
  const ellipsis = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-three-dots text-end text-secondary mx-1"
      viewBox="0 0 16 16"
    >
      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );

  return (
    <>
      <PageButton target={generatorUrl(1)} page={1} active={active} />
      {ellipsisFront && ellipsis}
      {pagesLocal.map((curPage) => (
        <PageButton
          target={generatorUrl(curPage)}
          page={curPage}
          active={active}
          key={curPage}
        />
      ))}
      {ellipsisBack && ellipsis}
      <PageButton
        target={generatorUrl(numPages)}
        page={numPages}
        active={active}
      />
    </>
  );
}
