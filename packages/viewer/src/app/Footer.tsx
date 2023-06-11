export default function Footer({ children }: React.PropsWithChildren) {
  return (
    <footer className="py-3 py-md-4 mt-5 bg-body-tertiary">
      <div className="container-lg py-3 py-md-4 px-4 px-md-3 text-body-secondary">
        <div className="row">
          <div className="col-lg-3 mb-3">
            <a
              className="d-inline-flex align-items-center mb-2 text-body-emphasis text-decoration-none"
              href="/"
              aria-label="Bootstrap"
            >
              <span className="fs-5">Luogu Discussion Archive</span>
            </a>
            <ul className="list-unstyled small">
              <li className="mb-2">
                全新的洛谷讨论保存站由 Piterator
                打造，拥有更赏心悦目的界面、更稳定的爬取器、更方便的体验，我们总是在不断尝试。
              </li>
              <li className="mb-2">{children}</li>
              <li className="mb-2">&copy; 2023 Piterator</li>
              <li className="mb-2">v0.0.1 内测版</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
