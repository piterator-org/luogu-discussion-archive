declare global {
  const VERSION: string;
  const COMMITHASH: string;
  const BRANCH: string;
  const LASTCOMMITDATETIME: string;
}

function ExternalLink(
  params: Omit<JSX.IntrinsicElements["a"], "className" | "target" | "rel">,
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
            <a
              className="d-inline-flex align-items-center mb-1 text-body-emphasis text-decoration-none fs-5"
              href="/"
            >
              Luogu Discussion Archive
            </a>
            <div className="mt-2">
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
            <div className="mt-2">
              We improve our products and advertising by using{" "}
              <ExternalLink href="https://clarity.microsoft.com/">
                Microsoft Clarity
              </ExternalLink>{" "}
              to see how you use our website. By using our site, you agree that
              we and Microsoft can collect and use this data.
            </div>
            <div className="mt-2">
              &copy; 2023 Piterator &middot;{" "}
              <ExternalLink href="https://github.com/piterator-org/luogu-discussion-archive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className="bi bi-github position-relative"
                  viewBox="0 0 16 16"
                  style={{ top: "-.1em" }}
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>{" "}
                GitHub
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
