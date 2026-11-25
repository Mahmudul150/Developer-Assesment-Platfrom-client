import { FileCheck2, ShieldCheck, Timer, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Role-based access",
    text: "Admins, companies and candidates see only what they should.",
  },
  {
    icon: Timer,
    title: "Timed exams",
    text: "Server-driven deadlines with autosave and auto-submit.",
  },
  {
    icon: FileCheck2,
    title: "Fair evaluation",
    text: "MCQs graded instantly, written answers reviewed by your team.",
  },
  {
    icon: Users,
    title: "One-click demo logins",
    text: "Explore every role instantly with the built-in demo accounts.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Built-in features for every stage of the hiring process.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative overflow-hidden border-muted hover:border-primary/50 transition-all duration-300 hover:-translate-y-1",
              )}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {feature.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
