import { BsThreeDots } from "react-icons/bs";
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
  const ellipsis = <BsThreeDots className="text-end text-secondary mx-1" />;

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
