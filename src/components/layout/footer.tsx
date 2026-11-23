import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-bold">{APP_NAME}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A fair way to hire developers.
          </p>
        </div>
        <div>
          <p className="font-semibold">Platform</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/assessments">Assessments</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Company</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Legal</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Â© {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
