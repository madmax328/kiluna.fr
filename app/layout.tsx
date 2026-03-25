import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const baseUrl = "https://kiluna.fr";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kiluna — Détecteur de clauses abusives dans vos contrats",
    template: "%s | Kiluna",
  },
  description:
    "Uploadez votre bail, CDI, contrat freelance ou abonnement. L'IA détecte les clauses abusives ou illégales en 60 secondes. Rapport complet dès 2,99€.",
  keywords: [
    "clauses abusives",
    "analyse contrat IA",
    "bail location clause abusive",
    "contrat CDI illégal",
    "contrat freelance analyse",
    "droit français contrat",
    "protection locataire",
    "IA juridique",
    "clause illégale bail",
    "vérifier contrat travail",
    "analyser contrat en ligne",
    "clause non-concurrence illégale",
  ],
  authors: [{ name: "Kiluna" }],
  creator: "Kiluna",
  publisher: "Kiluna",
  category: "Legal Technology",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "Kiluna",
    title: "Kiluna — Détecteur de clauses abusives dans vos contrats",
    description:
      "L'IA qui analyse vos contrats et détecte les clauses abusives ou illégales en 60 secondes. Bail, CDI, freelance — droit français. Dès 2,99€.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiluna — Détecteur de clauses abusives",
    description:
      "L'IA qui analyse vos contrats et détecte les clauses abusives ou illégales en 60 secondes. Dès 2,99€.",
    site: "@kilunaFR",
    creator: "@kilunaFR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "",
  },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kiluna",
  url: baseUrl,
  description:
    "Analyse automatique de contrats par IA pour détecter les clauses abusives ou illégales selon le droit français.",
  applicationCategory: "LegalService",
  offers: {
    "@type": "Offer",
    price: "2.99",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    description: "Rapport d'analyse complet de contrat",
  },
  inLanguage: "fr-FR",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Mes données sont-elles conservées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Ton contrat est analysé en temps réel et n'est jamais stocké sur nos serveurs. L'analyse est instantanée et confidentielle.",
      },
    },
    {
      "@type": "Question",
      name: "Le rapport remplace-t-il un avocat ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Kiluna fournit une analyse informative basée sur le droit français. Pour une situation grave ou un litige, consulte un professionnel du droit.",
      },
    },
    {
      "@type": "Question",
      name: "Quels formats de fichiers acceptez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDF et TXT jusqu'à 10 Mo. Pour les PDF scannés (images), le texte doit être sélectionnable.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps pour recevoir le rapport ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'analyse préliminaire prend moins de 60 secondes. Le rapport complet est généré immédiatement après le paiement.",
      },
    },
    {
      "@type": "Question",
      name: "Quels types de contrats analysez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kiluna analyse tout document juridique en français : bail de location, contrat de travail (CDI, CDD), contrat freelance, abonnements, CGU, partenariats commerciaux.",
      },
    },
  ],
};

// ── TikTok Pixel ──────────────────────────────────────────────────────────────
// Remplace TIKTOK_PIXEL_ID par ton ID (ex: C1A2B3C4D5E6F7G8H9)
// Visible dans TikTok Ads Manager > Actifs > Événements > ton pixel
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";

const tiktokPixelScript = TIKTOK_PIXEL_ID
  ? `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
  `.trim()
  : "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased ${inter.variable}`}>
      <head>
        {tiktokPixelScript && (
          <script
            dangerouslySetInnerHTML={{ __html: tiktokPixelScript }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdApp).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdFaq).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
