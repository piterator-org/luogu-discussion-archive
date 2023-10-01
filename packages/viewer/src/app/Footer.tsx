import Link from "next/link";
import { BsGithub } from "react-icons/bs";

declare global {
  const VERSION: string;
  const COMMITHASH: string;
  const BRANCH: string;
  const LASTCOMMITDATETIME: string;
}

function ExternalLink(
  params: Omit<JSX.IntrinsicElements["a"], "className" | "target" | "rel">
) {
  return (
    <a // eslint-disable-line jsx-a11y/anchor-has-content
      className="link-secondary text-decoration-none"
      target="_blank"
      rel="noopener noreferrer"
      {...params} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
}

export default function Footer() {
  return (
    <footer className="py-3 py-md-4 mt-5 bg-body-tertiary">
      <div className="container-lg py-3 py-md-4 px-4 px-md-3 text-secondary">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-8 mb-3 small">
            <Link
              className="d-inline-flex align-items-center mb-1 text-body-emphasis text-decoration-none fs-5"
              href="/"
              lang="en"
            >
              Luogu Discussion Archive
            </Link>
            <div className="mt-2" lang="en">
              We use Google Analytics on our site. For more information, see{" "}
              <ExternalLink href="https://www.google.cn/policies/privacy/partners/">
                Google&apos;s Privacy &amp; Terms
              </ExternalLink>{" "}
              and{" "}
              <ExternalLink href="https://support.google.com/analytics/answer/6004245">
                Safeguarding your data
              </ExternalLink>
              .
            </div>
            <div className="mt-2" lang="en">
              We improve our products and advertising by using{" "}
              <ExternalLink href="https://clarity.microsoft.com/">
                Microsoft Clarity
              </ExternalLink>{" "}
              to see how you use our website. By using our site, you agree that
              we and Microsoft can collect and use this data.
            </div>
            <div className="mt-2">
              &copy; 2023 Piterator &middot;{" "}
              <ExternalLink
                href="mailto:lda@piterator.com"
                title="电子邮箱：lda@piterator.com"
              >
                联系我们
              </ExternalLink>{" "}
              &middot;{" "}
              <Link
                href="/removal"
                className="link-secondary text-decoration-none"
              >
                删帖政策
              </Link>{" "}
              &middot;{" "}
              <ExternalLink href="https://github.com/piterator-org/luogu-discussion-archive">
                <BsGithub className="position-relative" /> GitHub
              </ExternalLink>
            </div>
            <div className="mt-2">
              <ExternalLink
                href={`https://github.com/piterator-org/luogu-discussion-archive/commit/${COMMITHASH}`}
              >
                {VERSION}
              </ExternalLink>{" "}
              @{" "}
              {new Date(LASTCOMMITDATETIME).toLocaleString("zh", {
                timeZone: "Asia/Shanghai",
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
