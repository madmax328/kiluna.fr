"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, CheckCircle, AlertTriangle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Clause = {
  title: string;
  severity: "ok" | "suspicious" | "illegal";
  excerpt: string;
  explanation: string;
  rights: string;
  action: string;
};

type Report = {
  contractType: string;
  analysisDate: string;
  clauses: Clause[];
  summary: string;
  urgentActions: string[];
};

const severityConfig = {
  ok: {
    label: "Normale",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-950/30",
    border: "border-green-800",
    badge: "bg-green-900 text-green-300",
  },
  suspicious: {
    label: "Suspecte",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-950/30",
    border: "border-amber-800",
    badge: "bg-amber-900 text-amber-300",
  },
  illegal: {
    label: "Potent. illégale",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-950/30",
    border: "border-red-800",
    badge: "bg-red-900 text-red-300",
  },
};

function RapportContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentIntentId = searchParams.get("payment_intent");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId && !paymentIntentId) {
      setError("Session invalide");
      setLoading(false);
      return;
    }
    const param = sessionId
      ? `session_id=${sessionId}`
      : `payment_intent=${paymentIntentId}`;
    fetch(`/api/rapport?${param}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setReport(data);
      })
      .catch(() => setError("Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-slate-400">Génération de votre rapport...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <h1 className="text-xl font-bold">Rapport indisponible</h1>
        <p className="text-slate-400">{error || "Une erreur est survenue"}</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  const illegalClauses = report.clauses.filter((c) => c.severity === "illegal");
  const suspiciousClauses = report.clauses.filter((c) => c.severity === "suspicious");

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">kiluna</span>
      </div>

      <div className="bg-green-950/30 border border-green-800 rounded-2xl p-4 mb-8 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
        <p className="text-green-300 text-sm font-medium">Paiement confirmé — voici ton rapport complet</p>
      </div>

      <h1 className="text-3xl font-bold mb-2">Rapport d'analyse</h1>
      <p className="text-slate-400 mb-1">{report.contractType}</p>
      <p className="text-slate-500 text-sm mb-6">Analysé le {report.analysisDate}</p>

      {/* Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <h2 className="font-semibold mb-2">Résumé</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{report.summary}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { count: report.clauses.filter((c) => c.severity === "ok").length, label: "Clauses normales", color: "text-green-400" },
          { count: suspiciousClauses.length, label: "Clauses suspectes", color: "text-amber-400" },
          { count: illegalClauses.length, label: "Potent. illégales", color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent actions */}
      {report.urgentActions.length > 0 && (
        <div className="bg-red-950/30 border border-red-800 rounded-2xl p-5 mb-6">
          <h2 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Actions urgentes
          </h2>
          <ul className="space-y-2">
            {report.urgentActions.map((action, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clauses */}
      <h2 className="font-semibold text-lg mb-4">Analyse clause par clause</h2>
      <div className="space-y-4 mb-8">
        {report.clauses.map((clause, i) => {
          const config = severityConfig[clause.severity];
          const Icon = config.icon;
          return (
            <div key={i} className={`${config.bg} border ${config.border} rounded-2xl p-5`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
                  <h3 className="font-semibold text-sm">{clause.title}</h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              {clause.excerpt && (
                <blockquote className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-3 mb-3">
                  "{clause.excerpt}"
                </blockquote>
              )}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-400 font-medium">Ce que ça veut dire : </span>
                  <span className="text-slate-300">{clause.explanation}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Tes droits : </span>
                  <span className="text-slate-300">{clause.rights}</span>
                </div>
                {clause.severity !== "ok" && (
                  <div>
                    <span className="text-slate-400 font-medium">Que faire : </span>
                    <span className="text-slate-300">{clause.action}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-slate-500 text-xs mb-8">
        Ce rapport est fourni à titre informatif et ne constitue pas un avis juridique.
        Pour toute situation grave, consultez un avocat.
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Analyser un autre contrat
      </Link>
    </main>
  );
}

export default function RapportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
      </div>
    }>
      <RapportContent />
    </Suspense>
  );
}
