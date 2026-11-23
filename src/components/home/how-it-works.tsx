import { BarChart3, ClipboardList, Send } from "lucide-react";

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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Three roles, one straightforward hiring workflow.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.role} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                {step.role}
              </p>
              <h3 className="mt-1 font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
