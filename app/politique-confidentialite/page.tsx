import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et RGPD de Kiluna.fr — traitement des données personnelles, droits des utilisateurs.",
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialite() {
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
        <h1 className="text-4xl font-black text-gray-950 mb-2">Politique de confidentialité</h1>
        <p className="text-gray-400 text-sm mb-12">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
          Dernière mise à jour : mars 2026.
        </p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Responsable du traitement</h2>
            <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-1">
              <p><span className="font-semibold text-gray-700">Société :</span> [À compléter]</p>
              <p><span className="font-semibold text-gray-700">Email DPO :</span> contact@kiluna.fr</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Données collectées et finalités</h2>

            <div className="space-y-5">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm">Fichier contrat uploadé</h3>
                </div>
                <div className="px-5 py-4 text-sm space-y-2">
                  <p><span className="font-medium text-gray-700">Nature :</span> PDF ou fichier texte fourni par l'utilisateur</p>
                  <p><span className="font-medium text-gray-700">Finalité :</span> Analyse automatique par IA pour détecter les clauses abusives</p>
                  <p><span className="font-medium text-gray-700">Durée de conservation :</span> <strong className="text-green-700">Aucune — le fichier est traité en mémoire et immédiatement détruit après l'analyse. Il n'est jamais écrit sur disque ni stocké.</strong></p>
                  <p><span className="font-medium text-gray-700">Base légale :</span> Exécution du contrat (art. 6.1.b RGPD)</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm">Données de paiement</h3>
                </div>
                <div className="px-5 py-4 text-sm space-y-2">
                  <p><span className="font-medium text-gray-700">Nature :</span> Données de carte bancaire, email (traitées par Stripe)</p>
                  <p><span className="font-medium text-gray-700">Finalité :</span> Traitement du paiement pour le rapport complet (2,99€)</p>
                  <p><span className="font-medium text-gray-700">Durée :</span> Selon politique de Stripe (obligations légales comptables)</p>
                  <p><span className="font-medium text-gray-700">Base légale :</span> Exécution du contrat + obligation légale (art. 6.1.b et 6.1.c RGPD)</p>
                  <p><span className="font-medium text-gray-700">Sous-traitant :</span> Stripe Payments Europe, Ltd — <a href="https://stripe.com/fr/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">politique de confidentialité Stripe</a></p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm">Logs techniques</h3>
                </div>
                <div className="px-5 py-4 text-sm space-y-2">
                  <p><span className="font-medium text-gray-700">Nature :</span> Adresse IP, user-agent, horodatage des requêtes</p>
                  <p><span className="font-medium text-gray-700">Finalité :</span> Sécurité, détection d'abus, diagnostics techniques</p>
                  <p><span className="font-medium text-gray-700">Durée :</span> 30 jours maximum (logs Vercel)</p>
                  <p><span className="font-medium text-gray-700">Base légale :</span> Intérêt légitime (art. 6.1.f RGPD)</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Intelligence artificielle (OpenAI)</h2>
            <p>
              L'analyse des contrats est réalisée via l'API d'OpenAI. Le contenu du document est transmis à l'API
              OpenAI pour traitement. OpenAI est un sous-traitant au sens du RGPD.
              Conformément aux conditions d'utilisation API d'OpenAI, les données soumises via l'API ne sont pas
              utilisées pour entraîner les modèles.
            </p>
            <p className="mt-3">
              Sous-traitant : OpenAI, LLC — San Francisco, CA, États-Unis —{" "}
              <a href="https://openai.com/policies/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                politique de confidentialité OpenAI
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies</h2>
            <p>
              Kiluna.fr n'utilise pas de cookies de tracking, de publicité ou d'analyse tiers.
              Un cookie de session (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">sessionStorage</code>) est utilisé
              exclusivement pour transmettre le nom du fichier entre les pages durant votre session.
              Il est automatiquement supprimé à la fermeture de l'onglet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Transferts hors UE</h2>
            <p>
              Le traitement de l'analyse par IA implique un transfert de données vers OpenAI (États-Unis).
              Ce transfert est encadré par les Clauses Contractuelles Types (CCT) de la Commission européenne.
              Le traitement des paiements implique un transfert vers Stripe Inc. (États-Unis), encadré par le Privacy Shield.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { droit: "Droit d'accès", desc: "Obtenir une copie des données vous concernant" },
                { droit: "Droit de rectification", desc: "Corriger des données inexactes" },
                { droit: "Droit à l'effacement", desc: "Demander la suppression de vos données (\"droit à l'oubli\")" },
                { droit: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré" },
                { droit: "Droit d'opposition", desc: "Vous opposer à certains traitements" },
                { droit: "Droit de limitation", desc: "Limiter le traitement de vos données dans certains cas" },
              ].map((item) => (
                <li key={item.droit} className="flex gap-2">
                  <span className="text-blue-500 font-bold shrink-0">→</span>
                  <span><strong className="text-gray-700">{item.droit} :</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@kiluna.fr" className="text-blue-600 hover:underline">contact@kiluna.fr</a>.
              Nous répondrons dans un délai d'un mois. En cas de litige, vous pouvez déposer une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Sécurité</h2>
            <p>
              Kiluna met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              chiffrement HTTPS/TLS sur toutes les communications, pas de stockage permanent des fichiers contractuels,
              infrastructure hébergée sur Vercel avec des garanties de sécurité de niveau entreprise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle, nous l'indiquerons
              par la date de mise à jour en haut de cette page. Nous vous encourageons à la consulter régulièrement.
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
