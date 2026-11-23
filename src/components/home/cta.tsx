import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Cta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold">
          Ready to find your next great developer?
        </h2>
        <p className="mt-3 opacity-90">
          Create your first assessment in minutes.
        </p>
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "mt-6",
          )}
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
