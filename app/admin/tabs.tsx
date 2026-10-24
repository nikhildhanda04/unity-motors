"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Cars / Parts switch. Two sections of one admin, not two admins. */
export default function AdminTabs() {
  const path = usePathname();
  const onProducts = path.startsWith("/admin/product");

  const tab = (active: boolean) =>
    `px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
      active
        ? "bg-[#1b2126] text-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="flex items-center gap-1">
      <Link href="/admin" className={tab(!onProducts)}>
        Cars
      </Link>
      <Link href="/admin/products" className={tab(onProducts)}>
        Parts
      </Link>
    </nav>
  );
}
