import type { Metadata } from "next";
import Link from "next/link";

import { TextPage } from "@/components/text-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: "Terms for buying original paintings from Irina Davis.",
};

export default function TermsPage() {
  return (
    <TextPage title="Terms of Sale" intro="Last updated: [date]">
      <h2>Who you&apos;re buying from</h2>
      <p>Paintings on this website are sold by {site.name}, [business name and address], {site.location}.</p>

      <h2>Prices and payment</h2>
      <p>
        All prices are in US dollars. [Sales tax is added at checkout where required.] Payments are processed securely
        by Stripe. Your card details go directly to Stripe and are never stored on this website.
      </p>

      <h2>Originals and availability</h2>
      <p>
        Every painting is an original and there is only one of each. A painting is reserved for you once your payment
        is complete. In the rare case that two people buy the same painting at the same moment, the later order will be
        fully refunded.
      </p>

      <h2>Colors and photos</h2>
      <p>
        Paintings are photographed in natural light to show their colors as accurately as possible, but colors can look
        slightly different on different screens.
      </p>

      <h2>Copyright</h2>
      <p>
        Buying a painting gives you ownership of the physical artwork. {site.name} keeps the copyright, which means the
        painting may not be reproduced (for example as prints) without written permission.
      </p>

      <h2>Shipping and returns</h2>
      <p>
        See <Link href="/shipping-returns">Shipping &amp; Returns</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </TextPage>
  );
}
