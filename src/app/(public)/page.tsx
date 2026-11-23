import type { Metadata } from "next";
import Image from "next/image";
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
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Image
          src="/images/assessment.svg"
          alt="A developer completing a timed assessment"
          width={480}
          height={320}
          className="mx-auto w-full max-w-2xl rounded-2xl"
        />
      </section>
      <HowItWorks />
      <FeaturesGrid />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">Latest assessments</h2>
          <div className="mt-10">
            <LatestAssessmentsServer assessments={result.data} />
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
