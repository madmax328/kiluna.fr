"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Shield,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

type AnalysisPreview = {
  clauseCount: number;
  suspiciousCount: number;
  illegalCount: number;
  previewClauses: { title: string; severity: "ok" | "suspicious" | "illegal" }[];
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Dépose ton contrat",
    desc: "PDF ou TXT jusqu'à 10 Mo. Bail, CDI, freelance, abonnement — on accepte tout.",
  },
  {
    step: "02",
    title: "L'IA analyse chaque clause",
    desc: "Notre IA parcourt le contrat clause par clause et évalue leur conformité au droit français.",
  },
  {
    step: "03",
    title: "Reçois ton rapport complet",
    desc: "Tes droits, ce que tu peux contester, et quoi faire concrètement — en français simple.",
  },
];

const CONTRACT_TYPES = [
  { icon: "🏠", label: "Bail de location", desc: "Résidentiel & commercial" },
  { icon: "💼", label: "Contrat de travail", desc: "CDI, CDD, alternance" },
  { icon: "💻", label: "Contrat freelance", desc: "Prestation & mission" },
  { icon: "📱", label: "Abonnements", desc: "CGU, SaaS, services" },
  { icon: "🤝", label: "Partenariat", desc: "Accord commercial" },
  { icon: "📄", label: "Autre contrat", desc: "Tout document juridique" },
];

const TESTIMONIALS = [
  {
    text: "Mon propriétaire avait glissé une clause pour me faire payer les réparations de plomberie. Kiluna l'a repéré en 30 secondes et j'ai pu le retirer avant de signer.",
    author: "Marie L.",
    role: "Locataire, Paris 18e",
    stars: 5,
  },
  {
    text: "Clause de non-concurrence de 3 ans dans mon CDI. Le rapport m'a expliqué qu'elle était illégale dans mon cas et comment la contester. Je l'ai fait supprimer.",
    author: "Thomas R.",
    role: "Développeur, Lyon",
    stars: 5,
  },
  {
    text: "Mon client avait une clause de cession de droits totale et permanente. Pour 2,99€, j'ai eu l'analyse complète et j'ai renégocié. Ça valait le coup.",
    author: "Camille D.",
    role: "Graphiste indépendante, Bordeaux",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "Mes données sont-elles conservées ?",
    a: "Non. Ton contrat est analysé en temps réel et n'est jamais stocké sur nos serveurs. L'analyse est instantanée et confidentielle.",
  },
  {
    q: "Le rapport remplace-t-il un avocat ?",
    a: "Non. Kiluna fournit une analyse informative basée sur le droit français. Pour une situation grave ou un litige, consulte un professionnel du droit.",
  },
  {
    q: "Quels formats de fichiers acceptez-vous ?",
    a: "PDF et TXT jusqu'à 10 Mo. Pour les PDF scannés (images), le texte doit être sélectionnable.",
  },
  {
    q: "Combien de temps pour recevoir le rapport ?",
    a: "L'analyse préliminaire prend moins de 60 secondes. Le rapport complet est généré immédiatement après le paiement.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-sm">★</span>
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/50 transition-colors"
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

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

  const handlePayment = () => {
    if (!preview) return;
    sessionStorage.setItem("kiluna_filename", file?.name || "");
    window.location.href = "/paiement";
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center pt-16 pb-12 w-full max-w-2xl text-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">kiluna</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Ton contrat cache-t-il des{" "}
          <span className="text-indigo-400">clauses abusives ?</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Upload ton bail, CDI, contrat freelance ou abonnement. L'IA analyse chaque clause
          et te dit ce qui est suspect ou illégal — en français simple.
        </p>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="flex gap-8 mb-10 text-center">
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

      {/* ── Upload zone ──────────────────────────────────── */}
      <div className="w-full max-w-xl mb-16">
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
                  <p className="text-slate-300 font-medium mb-1">Glisse ton contrat ici</p>
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
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="mt-3 w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors"
            >
              Analyser un autre contrat
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </div>

      {/* ── Trust signals ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6 max-w-xl text-center mb-24">
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

      {/* ── Comment ça marche ────────────────────────────── */}
      <section className="w-full max-w-3xl mb-24 px-4">
        <h2 className="text-2xl font-bold text-center mb-10">Comment ça marche</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="flex flex-col gap-3">
              <div className="text-4xl font-black text-indigo-600/40">{step.step}</div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Types de contrats ────────────────────────────── */}
      <section className="w-full max-w-3xl mb-24 px-4">
        <h2 className="text-2xl font-bold text-center mb-3">Quels contrats on analyse</h2>
        <p className="text-slate-400 text-center text-sm mb-10">
          Tout document juridique en français est accepté.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CONTRACT_TYPES.map((c) => (
            <div
              key={c.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="font-medium text-sm">{c.label}</div>
                <div className="text-slate-500 text-xs">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────────── */}
      <section className="w-full max-w-3xl mb-24 px-4">
        <h2 className="text-2xl font-bold text-center mb-3">Ils ont protégé leurs droits</h2>
        <p className="text-slate-400 text-center text-sm mb-10">
          Des vraies personnes, de vraies clauses abusives trouvées.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3"
            >
              <StarRating count={t.stars} />
              <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div>
                <div className="font-semibold text-sm">{t.author}</div>
                <div className="text-slate-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="w-full max-w-2xl mb-24 px-4">
        <h2 className="text-2xl font-bold text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-800 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">kiluna</span>
        </div>
        <p className="text-slate-600 text-xs">
          Analyse informative · Ne constitue pas un avis juridique · Pour toute situation grave,
          consultez un avocat
        </p>
        <p className="text-slate-700 text-xs mt-2">© {new Date().getFullYear()} kiluna.fr</p>
      </footer>
    </main>
  );
}
