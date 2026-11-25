"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SidebarNav({
  items,
  onClose,
}: {
  items: NavItem[];
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" &&
            item.href !== "/company" &&
            item.href !== "/candidate" &&
            pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onClose?.()}
            className={cn(
              "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              active && "bg-primary/10 font-medium text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
