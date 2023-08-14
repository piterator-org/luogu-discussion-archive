"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function NavBar() {
  useEffect(() => {
    import("bootstrap/js/dist/collapse");
  });

  return (
    <nav className="navbar navbar-expand-md sticky-top bg-body shadow-bssb-sm">
      <div className="container-lg d-flex my-1 px-3x px-md-container-default">
        <Link className="navbar-brand" href="/">
          <div
            className="position-relative"
            style={{ width: "5.5121146772em", height: "1.5em" }}
          >
            <Image
              src="/piterator-x-exlg.svg"
              alt="Logo"
              fill
              className="d-inline-block align-text-top"
            />
          </div>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-bssb-sm"
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
                保存帖子
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/explore">
                发现
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/index/1">
                索引
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/popular">
                热门
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/judgement">
                陶片放逐
              </Link>
            </li>
            <li className="nav-item my-tiny my-md-0">
              <Link className="nav-link" href="/about">
                关于
              </Link>
            </li>
          </ul>
          <form className="d-flex my-tiny my-md-0" role="search">
            <input
              className="form-control border-0 shadow-bssb-sm me-2"
              type="search"
              disabled
              placeholder="帖子关键词、发布者"
            />
            <button
              className="btn btn-outline-success shadow-bssb-sm text-nowrap"
              type="submit"
              disabled
            >
              即将上线
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
