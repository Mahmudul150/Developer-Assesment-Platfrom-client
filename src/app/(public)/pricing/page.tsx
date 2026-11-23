import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing.",
};

const fee = Number(process.env.NEXT_PUBLIC_PLATFORM_FEE ?? 1500);

const plans = [
  {
    name: "Browse",
    price: "Free",
    features: [
      "Browse published assessments",
      "Create a candidate account",
      "See results after evaluation",
    ],
  },
  {
    name: "Publish an assessment",
    price: formatCurrency(fee),
    features: [
      "Unlimited problems in your bank",
      "MCQ, written and coding questions",
      "Email invitations to candidates",
      "Timed attempts with autosave",
      "Manual evaluation and analytics",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <h1 className="text-center text-4xl font-bold">Simple pricing</h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        One platform fee per published assessment. No subscriptions.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.name === "Publish an assessment"
                ? "border-primary shadow-lg"
                : ""
            }
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> {feature}
                </p>
              ))}
            </CardContent>
            <CardFooter>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({
                    variant:
                      plan.name === "Publish an assessment"
                        ? "default"
                        : "outline",
                  }),
                  "w-full",
                )}
              >
                Get started
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
