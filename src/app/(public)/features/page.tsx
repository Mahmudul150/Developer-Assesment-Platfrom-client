import type { Metadata } from "next";
import { FeaturesGrid } from "@/components/home/features-grid";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore platform features.",
};

export default function FeaturesPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Features built for fair hiring</h1>
      </div>
      <FeaturesGrid />
      <HowItWorks />
    </>
  );
}
