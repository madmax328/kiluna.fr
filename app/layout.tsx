import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiluna — Détecteur de clauses abusives",
  description: "Uploadez votre contrat (bail, CDI, freelance...) et l'IA détecte les clauses abusives ou illégales en 60 secondes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-white">{children}</body>
    </html>
  );
}
