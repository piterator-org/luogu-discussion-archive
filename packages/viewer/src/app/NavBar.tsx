"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NavBar() {
  useEffect(() => {
    import("bootstrap/js/dist/collapse");
  });

  return (
    <nav className="navbar navbar-expand-md sticky-top bg-body shadow-sm">
      <div className="container-lg d-flex my-1 px-3x px-md-container-default">
        <Link className="navbar-brand" href="/">
          LgLg.top
        </Link>
        <button
          className="navbar-toggler border-0 shadow-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/">
                发现
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/top">
                排行榜
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/judgement">
                陶片放逐
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/save">
                保存帖子
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <a className="nav-link" href="/">
                关于
              </a>
            </li>
          </ul>
          <form className="d-flex my-tiny my-md-0" role="search">
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
