import { FileCheck2, ShieldCheck, Timer, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="border-y bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold">Everything you need</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {feature.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
