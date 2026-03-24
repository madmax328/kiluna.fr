import type { Metadata } from "next";
import "./globals.css";

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
    "analyse contrat",
    "bail location",
    "contrat CDI",
    "contrat freelance",
    "droit français",
    "protection locataire",
    "IA juridique",
    "clause illégale",
  ],
  authors: [{ name: "Kiluna" }],
  creator: "Kiluna",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "Kiluna",
    title: "Kiluna — Détecteur de clauses abusives",
    description:
      "L'IA qui analyse vos contrats et détecte les clauses abusives ou illégales en 60 secondes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kiluna — Analyse de contrats par IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiluna — Détecteur de clauses abusives",
    description:
      "L'IA qui analyse vos contrats et détecte les clauses abusives ou illégales en 60 secondes.",
    images: ["/og-image.png"],
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
};

const jsonLd = {
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
    description: "Rapport d'analyse complet de contrat",
  },
  inLanguage: "fr-FR",
  operatingSystem: "All",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
