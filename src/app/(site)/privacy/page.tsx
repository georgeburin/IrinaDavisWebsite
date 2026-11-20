import type { Metadata } from "next";

import { TextPage } from "@/components/text-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What information this website collects and how it is used.",
};

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy" intro="Last updated: [date]">
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you send a message:</strong> your name, email address and message, so we can reply.
        </li>
        <li>
          <strong>When you buy a painting:</strong> your name, email, shipping address and phone number, so we can
          deliver it. Payments are handled by Stripe. We never see or store your card number.
        </li>
        <li>[Website analytics, if you add them later.]</li>
      </ul>

      <h2>How it&apos;s used</h2>
      <p>
        Only to answer your questions, process and ship your order, and keep the records required for taxes. We
        don&apos;t sell your information or use it for advertising.
      </p>

      <h2>Who it&apos;s shared with</h2>
      <p>Stripe (payments) and the shipping carrier (delivery). [List any other services you use.]</p>

      <h2>Cookies</h2>
      <p>This site doesn&apos;t use advertising or tracking cookies. The only cookie is used to keep the artist signed in to the admin area.</p>

      <h2>Your choices</h2>
      <p>
        You can ask to see, correct or delete the information we hold about you at any time by emailing{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </TextPage>
  );
}
