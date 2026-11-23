import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Developer Assessment Platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-bold">About DevAssess</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        We built a platform where hiring teams can design fair, skill-based
        assessments and candidates can show what they can really do.
      </p>
      <p className="mt-4 text-muted-foreground">
        Our mission is to replace guesswork in technical hiring with evidence:
        real problems, clear scoring and a transparent process for everyone
        involved.
      </p>
    </div>
  );
}
