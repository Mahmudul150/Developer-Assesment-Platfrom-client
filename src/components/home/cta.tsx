import { Zap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Cta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="relative top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
      </div>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="relative inline-flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
          <Zap className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to find your next great developer?
        </h2>
        <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
          Create your first assessment in minutes and start evaluating
          candidates today.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Get started
          </Link>
          <Link
            href="/assessments"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "bg-background/50",
            )}
          >
            Explore assessments
          </Link>
        </div>
      </div>
    </section>
  );
}
