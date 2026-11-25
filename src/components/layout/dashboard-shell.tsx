"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { APP_NAME, type NavItem } from "@/lib/constants";
import type { Role } from "@/types/enums";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

export function DashboardShell({
  items,
  name,
  email,
  role,
  children,
}: {
  items: NavItem[];
  name: string;
  email: string;
  role: Role;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-background p-4 lg:block">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 px-2 text-lg font-bold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            D
          </span>
          {APP_NAME}
        </Link>
        <SidebarNav items={items} />
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-sm text-muted-foreground">Dashboard</div>
          <UserMenu name={name} email={email} role={role} />
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
      <Sheet open={open} onOpenChange={setOpen} title="Menu">
        <SidebarNav items={items} onClose={() => setOpen(false)} />
      </Sheet>
    </div>
  );
}





