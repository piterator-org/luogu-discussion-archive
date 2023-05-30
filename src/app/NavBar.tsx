import "./bootstrap.scss";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-md fixed-top bg-white shadow-sm">
      <div className="container-lg d-flex my-1">
        <a className="navbar-brand" href="/">
          LgLg.top
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                发现
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                排行榜
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                保存帖子
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                关于
              </a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control border-0 shadow-sm me-2"
              type="search"
              placeholder="帖子关键词、发布者"
            />
            <button
              className="btn btn-outline-success shadow-sm text-nowrap"
              type="submit"
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
