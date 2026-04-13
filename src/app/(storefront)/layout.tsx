import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { brandConfig } from "../../../brand.config";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {brandConfig.features.whatsappButton && <WhatsAppButton />}
      {brandConfig.features.cookieConsent && <CookieConsent />}
    </>
  );
}
