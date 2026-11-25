import { BarChart3, ClipboardList, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    role: "Company",
    title: "Build a role-specific test",
    text: "Create a problem bank, pick the right questions and set a passing score for the role you are hiring for.",
  },
  {
    icon: Send,
    role: "Candidate",
    title: "Take a fair, timed assessment",
    text: "Answer MCQ, written and coding questions with autosave, a server-driven timer and a clear result.",
  },
  {
    icon: BarChart3,
    role: "Admin",
    title: "Oversee the whole platform",
    text: "Approve companies, manage users and payments, and audit every important action in one place.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Three roles, one straightforward hiring workflow.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.role}
              className={cn(
                "group relative overflow-hidden border-muted hover:border-primary/50 transition-all duration-300",
                index === 0 && "ring-1 ring-primary/20",
              )}
            >
              <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <step.icon className="h-7 w-7" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {step.role}
                </p>
                <h3 className="text-xl font-bold">
                  {index + 1}. {step.title}
                </h3>
              </CardHeader>
              <CardContent className="text-center mt-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </CardContent>
              <CardFooter className="pt-8 pb-8 border-t border-muted/30">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Ready to start?</span>
                  <span className="text-primary">Get started →</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
