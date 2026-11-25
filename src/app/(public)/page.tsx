import type { Metadata } from "next";
import { Cta } from "@/components/home/cta";
import { FeaturesGrid } from "@/components/home/features-grid";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LatestAssessmentsServer } from "@/components/home/latest-assessments-server";
import { safeServerList } from "@/lib/server-api";
import type { Assessment } from "@/types/assessment";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Developer assessments that work",
    description:
      "Build role-specific assessments, invite candidates and evaluate real skills.",
  };
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await safeServerList<Assessment>(
    "/api/v1/assesment/all-published-assesment?limit=6",
  );

  return (
    <>
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight">
              Latest assessments
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Explore published assessments from verified companies.
            </p>
          </div>
          <div className="mt-0">
            <LatestAssessmentsServer assessments={result.data} />
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
