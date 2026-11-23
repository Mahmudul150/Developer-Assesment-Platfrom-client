import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="border-b bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="inline-block rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          Hire developers with confidence
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Developer assessments that actually work
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Create role-specific assessments, invite candidates, and evaluate real
          problem-solving skills â€” all in one place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Start hiring <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/assessments"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Browse assessments
          </Link>
        </div>
      </div>
    </section>
  );
}
