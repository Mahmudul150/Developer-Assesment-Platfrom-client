import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50k+", label: "Assessments created" },
  { value: "10k+", label: "Companies hiring" },
  { value: "98%", label: "Candidate satisfaction" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-24 sm:py-32 border-b">
      <div className="absolute inset-0 -z-10">
        <div className="relative top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
      </div>
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <CheckCircle className="h-3 w-3" /> Hire developers with confidence
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
          Developer assessments that
          <span className="text-primary"> actually work</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Create role-specific assessments, invite candidates, and evaluate real
          problem-solving skills — all in one place.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Start hiring <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
          <Link
            href="/assessments"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Browse assessments
          </Link>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 border-t border-muted/30 pt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
