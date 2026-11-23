import Image from "next/image";
import type * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image src={src} alt={alt} fill className={cn("object-cover", className)} />
  );
}

export function AvatarFallback({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
