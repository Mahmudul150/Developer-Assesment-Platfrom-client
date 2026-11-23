import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-4xl font-bold">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Questions about the platform? Reach our team and we will get back to
        you.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
