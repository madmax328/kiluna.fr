import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service Kiluna.fr — éditeur, hébergeur et informations légales obligatoires.",
  robots: { index: false, follow: false },
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-950 tracking-tight">
              kiluna<span className="text-blue-600">.fr</span>
            </span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-950 mb-2">Mentions légales</h1>
        <p className="text-gray-400 text-sm mb-12">Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
            <p>Le site kiluna.fr est édité par :</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-5 space-y-1 text-sm">
              <p><span className="font-semibold text-gray-700">Raison sociale :</span> [À compléter — nom ou raison sociale]</p>
              <p><span className="font-semibold text-gray-700">Forme juridique :</span> [À compléter — ex. : Auto-entrepreneur / SASU]</p>
              <p><span className="font-semibold text-gray-700">SIRET :</span> [À compléter]</p>
              <p><span className="font-semibold text-gray-700">Adresse :</span> [À compléter]</p>
              <p><span className="font-semibold text-gray-700">Email :</span> contact@kiluna.fr</p>
              <p><span className="font-semibold text-gray-700">Directeur de la publication :</span> [À compléter — nom du responsable]</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Hébergement</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-1 text-sm">
              <p><span className="font-semibold text-gray-700">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="font-semibold text-gray-700">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><span className="font-semibold text-gray-700">Site :</span> vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Description du service</h2>
            <p>
              Kiluna.fr est un service d'analyse automatique de documents contractuels par intelligence artificielle.
              Le service fournit une analyse informative des clauses contractuelles au regard du droit français.
              <strong className="text-gray-800"> Cette analyse ne constitue pas un conseil juridique et ne remplace pas l'avis d'un professionnel du droit.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le site kiluna.fr (textes, graphismes, logiciels, code source, marque)
              est la propriété exclusive de l'éditeur. Toute reproduction, représentation, modification ou exploitation
              non autorisée est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Responsabilité</h2>
            <p>
              Les analyses fournies par Kiluna sont générées automatiquement par un système d'intelligence artificielle.
              L'éditeur ne saurait être tenu responsable des erreurs, omissions ou inexactitudes dans les analyses produites,
              ni des décisions prises par l'utilisateur sur la base de ces analyses. Pour toute situation grave ou litige,
              il est recommandé de consulter un avocat ou un professionnel du droit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Paiement</h2>
            <p>
              Les paiements sont traités par <strong className="text-gray-800">Stripe Payments Europe, Ltd</strong>,
              un prestataire de services de paiement agréé. Kiluna ne stocke à aucun moment les données bancaires de ses utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Droit applicable</h2>
            <p>
              Le présent site et ses conditions d'utilisation sont soumis au droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse :
              <a href="mailto:contact@kiluna.fr" className="text-blue-600 hover:underline ml-1">contact@kiluna.fr</a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
