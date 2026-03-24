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
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "15px",
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
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-950 tracking-tight">
              kiluna<span className="text-blue-600">.fr</span>
            </span>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-900/8 ring-1 ring-gray-100 p-8">

            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-black text-gray-950 mb-1">Rapport complet</h1>
              <p className="text-gray-400 text-sm">Accès immédiat après paiement sécurisé</p>
            </div>

            {/* Ce que tu obtiens */}
            <ul className="space-y-3 mb-7">
              {[
                "Analyse clause par clause avec explications",
                "Tes droits détaillés pour chaque clause",
                "Actions concrètes à mener",
                "Clauses suspectes & illégales identifiées",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Prix */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-7">
              <div>
                <div className="font-bold text-gray-900 text-sm">Rapport d'analyse complet</div>
                <div className="text-gray-400 text-xs mt-0.5">Paiement unique · Sans abonnement</div>
              </div>
              <div className="text-3xl font-black text-blue-600">2,99€</div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Informations de carte
              </label>

              {stripeLoadError ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 text-red-600 text-sm">
                  Impossible de charger le module de paiement. Vérifiez votre connexion ou réessayez.
                </div>
              ) : (
                <div
                  className={`bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5 transition-opacity focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 ${
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
                <p className="text-red-600 text-sm mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || cardLoading || stripeLoadError}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 text-base"
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

            <div className="flex items-center justify-center gap-2 mt-5 text-gray-300 text-xs font-medium">
              <Lock className="w-3 h-3" />
              <span>Paiement sécurisé par Stripe · Aucune donnée conservée</span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'analyse
          </Link>
        </div>
      </main>
    </div>
  );
}
