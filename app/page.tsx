"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Shield, Upload, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

type AnalysisPreview = {
  clauseCount: number;
  suspiciousCount: number;
  illegalCount: number;
  previewClauses: { title: string; severity: "ok" | "suspicious" | "illegal" }[];
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<AnalysisPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setPreview(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const analyzeContract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Erreur lors de l'analyse");
      const data = await res.json();
      setPreview(data);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!preview) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file?.name }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight">kiluna</span>
      </div>

      {/* Hero */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Ton contrat cache-t-il des{" "}
          <span className="text-indigo-400">clauses abusives ?</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Upload ton bail, CDI, contrat freelance ou abonnement. L'IA analyse chaque clause
          et te dit ce qui est suspect ou illégal — en français simple.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mb-12 text-center">
        {[
          { value: "1 sur 3", label: "contrats contient une clause abusive" },
          { value: "60 sec", label: "pour analyser ton contrat" },
          { value: "2,99€", label: "rapport complet" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-bold text-indigo-400">{s.value}</div>
            <div className="text-slate-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div className="w-full max-w-xl">
        {!preview ? (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-950/30"
                  : "border-slate-700 hover:border-indigo-500 hover:bg-slate-900"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-slate-500 mx-auto mb-4" />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-indigo-300">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <p className="text-slate-300 font-medium mb-1">
                    Glisse ton contrat ici
                  </p>
                  <p className="text-slate-500 text-sm">PDF ou TXT · 10 Mo max</p>
                </>
              )}
            </div>

            {file && (
              <button
                onClick={analyzeContract}
                disabled={loading}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Analyser mon contrat gratuitement
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          /* Results preview */
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-2">Analyse terminée</h2>
            <p className="text-slate-400 text-sm mb-6">
              {preview.clauseCount} clauses analysées dans{" "}
              <span className="text-white font-medium">{file?.name}</span>
            </p>

            {/* Summary badges */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-green-950/50 border border-green-800 rounded-xl p-3 text-center">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-400">
                  {preview.clauseCount - preview.suspiciousCount - preview.illegalCount}
                </div>
                <div className="text-xs text-green-600">normales</div>
              </div>
              <div className="flex-1 bg-amber-950/50 border border-amber-800 rounded-xl p-3 text-center">
                <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-amber-400">{preview.suspiciousCount}</div>
                <div className="text-xs text-amber-600">suspectes</div>
              </div>
              <div className="flex-1 bg-red-950/50 border border-red-800 rounded-xl p-3 text-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-red-400">{preview.illegalCount}</div>
                <div className="text-xs text-red-600">potent. illégales</div>
              </div>
            </div>

            {/* Blurred preview */}
            <div className="space-y-2 mb-6 relative">
              {preview.previewClauses.map((clause, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    clause.severity === "illegal"
                      ? "border-red-800 bg-red-950/30"
                      : clause.severity === "suspicious"
                      ? "border-amber-800 bg-amber-950/30"
                      : "border-slate-700 bg-slate-800/50"
                  } ${i >= 2 ? "blur-sm select-none" : ""}`}
                >
                  <span className="text-sm font-medium">{clause.title}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      clause.severity === "illegal"
                        ? "bg-red-900 text-red-300"
                        : clause.severity === "suspicious"
                        ? "bg-amber-900 text-amber-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {clause.severity === "illegal"
                      ? "Illégale"
                      : clause.severity === "suspicious"
                      ? "Suspecte"
                      : "Normale"}
                  </span>
                </div>
              ))}
              {preview.previewClauses.length > 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent" />
              )}
            </div>

            <div className="bg-indigo-950/50 border border-indigo-800 rounded-xl p-4 mb-4 text-center">
              <p className="text-indigo-300 text-sm font-medium mb-1">
                Rapport complet avec explication de chaque clause
              </p>
              <p className="text-slate-400 text-xs">
                Ce que tu peux contester · Tes droits · Que faire maintenant
              </p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Voir le rapport complet — 2,99€
            </button>
            <button
              onClick={() => { setPreview(null); setFile(null); }}
              className="mt-3 w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors"
            >
              Analyser un autre contrat
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
        )}
      </div>

      {/* Trust signals */}
      <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl text-center">
        {[
          { icon: "🔒", title: "Confidentiel", desc: "Ton contrat n'est jamais stocké" },
          { icon: "⚡", title: "Instantané", desc: "Résultat en moins de 60 secondes" },
          { icon: "🇫🇷", title: "Droit français", desc: "Analyse basée sur la loi française" },
        ].map((t) => (
          <div key={t.title} className="text-center">
            <div className="text-3xl mb-2">{t.icon}</div>
            <div className="font-semibold text-sm">{t.title}</div>
            <div className="text-slate-500 text-xs mt-1">{t.desc}</div>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-slate-600 text-xs text-center">
        <p>kiluna.fr · Analyse informative, ne constitue pas un avis juridique</p>
      </footer>
    </main>
  );
}
