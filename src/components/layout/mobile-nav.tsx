"use client";

import type { VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";

type AuthLink = {
  href: string;
  label: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export function MobileNav({
  links,
  authLinks,
}: {
  links: Array<{ href: string; label: string }>;
  authLinks?: AuthLink[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title="Menu">
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          {authLinks?.map((link) => (
            <Button
              key={link.href}
              type="button"
              variant={link.variant ?? "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setOpen(false);
                router.push(link.href);
              }}
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </Sheet>
    </>
  );
}
