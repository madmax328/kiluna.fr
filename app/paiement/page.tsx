"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaiementPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeLoadError, setStripeLoadError] = useState(false);

  // Kept as `any` to avoid importing Stripe types from the vanilla bundle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripeRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardElementRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (!stripe) {
        if (mounted) setStripeLoadError(true);
        return;
      }
      if (!cardRef.current || !mounted) return;

      stripeRef.current = stripe;

      const elements = stripe.elements({ locale: "fr" });
      const card = elements.create("card", {
        style: {
          base: {
            color: "#111827",
            fontFamily: "system-ui, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            "::placeholder": { color: "#9ca3af" },
          },
          invalid: { color: "#dc2626", iconColor: "#dc2626" },
        },
      });

      card.mount(cardRef.current);
      cardElementRef.current = card;
      card.on("ready", () => { if (mounted) setCardLoading(false); });
    }

    init();
    return () => {
      mounted = false;
      cardElementRef.current?.unmount();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeRef.current || !cardElementRef.current || loading) return;

    setLoading(true);
    setError(null);

    const fileName =
      typeof window !== "undefined"
        ? sessionStorage.getItem("kiluna_filename") || ""
        : "";

    try {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      const { clientSecret, error: serverError } = await res.json();
      if (serverError) throw new Error(serverError);

      const { error: stripeError, paymentIntent } =
        await stripeRef.current.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElementRef.current },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Erreur de paiement");
      }
      if (paymentIntent?.status === "succeeded") {
        window.location.href = `/rapport?payment_intent=${paymentIntent.id}`;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              kiluna<span className="text-blue-600">.fr</span>
            </span>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Rapport complet</h1>
            <p className="text-gray-500 text-sm mb-6">Accès immédiat après paiement</p>

            {/* Ce que tu obtiens */}
            <ul className="space-y-2 mb-6">
              {[
                "Analyse clause par clause avec explications",
                "Tes droits détaillés pour chaque clause",
                "Actions concrètes à mener",
                "Clauses suspectes & illégales identifiées",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Prix */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Rapport d'analyse complet</div>
                <div className="text-gray-500 text-xs">Paiement unique, sans abonnement</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">2,99€</div>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Informations de carte
              </label>
              {stripeLoadError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600 text-sm">
                  Impossible de charger le module de paiement. Vérifiez votre connexion ou réessayez.
                </div>
              ) : (
                <div
                  className={`bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 transition-opacity ${
                    cardLoading ? "opacity-50" : ""
                  }`}
                >
                  {cardLoading && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement du formulaire...
                    </div>
                  )}
                  <div ref={cardRef} />
                </div>
              )}

              {error && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || cardLoading || stripeLoadError}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Payer 2,99€ — Accès immédiat
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
              <Lock className="w-3 h-3" />
              <span>Paiement sécurisé par Stripe · Aucune donnée conservée</span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'analyse
          </Link>
        </div>
      </main>
    </div>
  );
}
