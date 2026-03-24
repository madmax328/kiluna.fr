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
      if (!stripe || !cardRef.current || !mounted) return;

      stripeRef.current = stripe;

      const elements = stripe.elements({ locale: "fr" });
      const card = elements.create("card", {
        style: {
          base: {
            color: "#f8fafc",
            fontFamily: "system-ui, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            "::placeholder": { color: "#64748b" },
          },
          invalid: { color: "#f87171", iconColor: "#f87171" },
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
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">kiluna</span>
        </Link>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h1 className="text-xl font-bold mb-1">Rapport complet</h1>
          <p className="text-slate-400 text-sm mb-6">
            Accès immédiat après paiement
          </p>

          {/* What you get */}
          <ul className="space-y-2 mb-6">
            {[
              "Analyse clause par clause avec explications",
              "Tes droits détaillés pour chaque clause",
              "Actions concrètes à mener",
              "Clauses suspectes & illégales identifiées",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="flex items-center justify-between bg-indigo-950/50 border border-indigo-800 rounded-xl p-4 mb-6">
            <div>
              <div className="font-semibold text-sm">Rapport d'analyse complet</div>
              <div className="text-slate-400 text-xs">Paiement unique, sans abonnement</div>
            </div>
            <div className="text-2xl font-bold text-indigo-300">2,99€</div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Informations de carte
            </label>
            <div
              className={`bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 transition-opacity ${
                cardLoading ? "opacity-40" : ""
              }`}
            >
              <div ref={cardRef} />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-950/30 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || cardLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
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

          <div className="flex items-center justify-center gap-2 mt-4 text-slate-600 text-xs">
            <Lock className="w-3 h-3" />
            <span>Paiement sécurisé par Stripe · Aucune donnée conservée</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 mt-6 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'analyse
        </Link>
      </div>
    </main>
  );
}
