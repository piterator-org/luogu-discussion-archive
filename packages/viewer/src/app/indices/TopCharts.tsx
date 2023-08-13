"use client";

import { useState } from "react";

export default function Page({ children }: { children: React.ReactNode[] }) {
  const [selected, setSelected] = useState<string>("most-replied");

  return (
    <div className="pt-5 pb-3 pb-md-3x px-2 px-md-0">
      <h1 className="mb-4x text-center">索引</h1>
      <select
        className="form-select form-select-lg d-block d-md-none border-0 rounded-3 shadow-bssb-sm mb-4m"
        value={selected}
        onChange={({ target: { value } }) => setSelected(value)}
      >
        <option value="most-replied">最高楼层</option>
        <option value="most-recent">最新发布</option>
        <option value="most-viewed">最多点击</option>
      </select>
      <div className="row g-md-4m row-cols-1 row-cols-md-3">
        <div
          className={`col d-md-block ${
            selected !== "most-replied" ? "d-none" : ""
          }`}
        >
          {children[0]}
        </div>
        <div
          className={`col d-md-block ${
            selected !== "most-recent" ? "d-none" : ""
          }`}
        >
          {children[1]}
        </div>
        <div
          className={`col d-md-block ${
            selected !== "most-viewed" ? "d-none" : ""
          }`}
        >
          {children[2]}
        </div>
      </div>
    </div>
  );
}
