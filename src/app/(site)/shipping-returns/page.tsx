import type { Metadata } from "next";
import Link from "next/link";

import { TextPage } from "@/components/text-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "How paintings are packed and shipped, delivery times, and the return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <TextPage title="Shipping & Returns" intro="Every painting is packed by hand and shipped with tracking and insurance.">
      <h2>Processing time</h2>
      <p>Paintings ship within [3–5] business days of your order. You&apos;ll get an email with a tracking number as soon as your painting is on its way.</p>

      <h2>Packing</h2>
      <p>
        Each painting is wrapped in glassine paper, protected with corner guards and foam board, and shipped in a sturdy
        double-walled box. [Larger paintings ship in a wooden crate.]
      </p>

      <h2>Shipping costs and delivery</h2>
      <ul>
        <li>United States: [free shipping / $XX flat rate]. Delivery usually takes [3–7] business days.</li>
        <li>International: [available on request / not available yet]. Import duties and taxes are paid by the buyer.</li>
        <li>All shipments are fully insured and require a signature on delivery.</li>
      </ul>

      <h2>Returns</h2>
      <p>
        If you&apos;re not happy with your painting, you can return it within [14] days of delivery for a full refund of the
        purchase price. Please <Link href="/contact">get in touch</Link> before sending it back. The painting must be
        returned in its original condition and packaging. Return shipping is paid by [the buyer].
      </p>
      <p>Commissioned paintings can&apos;t be returned.</p>

      <h2>Damage in transit</h2>
      <p>
        If your painting arrives damaged, keep all the packaging, take photos of the box and the painting, and contact
        us within [48 hours] of delivery. We&apos;ll file the insurance claim and make it right.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or use the <Link href="/contact">contact form</Link>.
      </p>
    </TextPage>
  );
}
