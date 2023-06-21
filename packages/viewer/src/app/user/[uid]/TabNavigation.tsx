"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNavigation({ uid }: { uid: string }) {
  const pathname = usePathname();

  return (
    <ul className="nav nav-pills nav-fill rounded-4 shadow mb-4s">
      {[
        { children: "参与", href: `/user/${uid}` },
        { children: "发帖", href: `/user/${uid}/discussions` },
        { children: "回帖", href: `/user/${uid}/replies` },
      ].map(({ children, href }) => (
        <li className="nav-item" key={href}>
          <Link
            className={`nav-link${
              href === pathname ? " active" : ""
            } rounded-4`}
            href={href}
          >
            {children}
          </Link>
        </li>
      ))}
    </ul>
  );
}
