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
  Lock,
} from "lucide-react";

type AnalysisPreview = {
  clauseCount: number;
  suspiciousCount: number;
  illegalCount: number;
  previewClauses: { title: string; severity: "ok" | "suspicious" | "illegal" }[];
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Dépose ton contrat",
    desc: "PDF ou TXT jusqu'à 10 Mo. Bail, CDI, freelance, abonnement — on accepte tout.",
  },
  {
    step: "2",
    title: "L'IA analyse chaque clause",
    desc: "Notre IA parcourt le contrat clause par clause et évalue leur conformité au droit français.",
  },
  {
    step: "3",
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
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
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
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              kiluna<span className="text-blue-600">.fr</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Paiement sécurisé · Sans abonnement</span>
          </div>
        </div>
      </nav>

      {/* ── Hero 2 colonnes ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Colonne gauche */}
          <div>
            <div className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-6 border border-blue-100">
              Analyse de contrats par IA
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Ton contrat cache-t-il des{" "}
              <span className="text-blue-600">clauses abusives ?</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Upload ton bail, CDI, contrat freelance ou abonnement. L'IA analyse chaque clause
              et te dit ce qui est suspect ou illégal — en français simple.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10">
              {[
                { value: "1 sur 3", label: "contrats contient une clause abusive" },
                { value: "60 sec", label: "pour analyser" },
                { value: "2,99€", label: "rapport complet" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-blue-600">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-1 leading-snug max-w-[90px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Garanties */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: "🔒", label: "Confidentiel", desc: "Jamais stocké" },
                { icon: "⚡", label: "Instantané", desc: "Résultat en 60s" },
                { icon: "🇫🇷", label: "Droit français", desc: "Loi française" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite — Upload / Résultats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {!preview ? (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Dépose ton contrat pour commencer
                </p>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 font-medium text-sm mb-1">Glisse ton contrat ici</p>
                      <p className="text-gray-400 text-xs">PDF ou TXT · 10 Mo max</p>
                    </>
                  )}
                </div>

                {file && (
                  <button
                    onClick={analyzeContract}
                    disabled={loading}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
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

                {error && (
                  <p className="mt-3 text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-lg p-3">
                    {error}
                  </p>
                )}

                <p className="mt-4 text-center text-xs text-gray-400">
                  Analyse gratuite · Rapport complet à 2,99€
                </p>
              </>
            ) : (
              /* Résultats */
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Analyse terminée</h2>
                <p className="text-gray-500 text-sm mb-5">
                  {preview.clauseCount} clauses analysées dans{" "}
                  <span className="text-gray-800 font-medium">{file?.name}</span>
                </p>

                {/* Badges */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-700">
                      {preview.clauseCount - preview.suspiciousCount - preview.illegalCount}
                    </div>
                    <div className="text-xs text-green-600">normales</div>
                  </div>
                  <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-700">{preview.suspiciousCount}</div>
                    <div className="text-xs text-amber-600">suspectes</div>
                  </div>
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-red-700">{preview.illegalCount}</div>
                    <div className="text-xs text-red-600">potent. illégales</div>
                  </div>
                </div>

                {/* Aperçu flou */}
                <div className="space-y-2 mb-5 relative">
                  {preview.previewClauses.map((clause, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                        clause.severity === "illegal"
                          ? "border-red-200 bg-red-50"
                          : clause.severity === "suspicious"
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-200 bg-gray-50"
                      } ${i >= 2 ? "blur-sm select-none" : ""}`}
                    >
                      <span className="font-medium text-gray-800">{clause.title}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          clause.severity === "illegal"
                            ? "bg-red-100 text-red-700"
                            : clause.severity === "suspicious"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
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
                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-center">
                  <p className="text-blue-800 text-sm font-semibold mb-0.5">
                    Rapport complet avec explication de chaque clause
                  </p>
                  <p className="text-blue-600 text-xs">
                    Tes droits · Ce que tu peux contester · Que faire maintenant
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
                >
                  Voir le rapport complet — 2,99€
                </button>
                <button
                  onClick={() => { setPreview(null); setFile(null); }}
                  className="mt-3 w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
                >
                  Analyser un autre contrat
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                On t'accompagne à{" "}
                <span className="text-blue-600">chaque étape</span>
              </h2>
              <p className="text-gray-500 mb-10">Simple, rapide, sans jargon juridique.</p>
              <div className="space-y-8">
                {HOW_IT_WORKS.map((step) => (
                  <div key={step.step} className="flex gap-5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 flex flex-col gap-4">
              {[
                { icon: "🔒", title: "Confidentiel", desc: "Ton contrat n'est jamais stocké sur nos serveurs." },
                { icon: "⚡", title: "Instantané", desc: "Résultat en moins de 60 secondes." },
                { icon: "🇫🇷", title: "Droit français", desc: "Analyse basée sur la législation française en vigueur." },
                { icon: "💰", title: "Sans abonnement", desc: "Paiement unique de 2,99€, aucune surprise." },
              ].map((t) => (
                <div key={t.title} className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Types de contrats ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Quels contrats on analyse</h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Tout document juridique en français est accepté.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CONTRACT_TYPES.map((c) => (
            <div
              key={c.label}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{c.label}</div>
                <div className="text-gray-500 text-xs">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Ils ont protégé leurs droits</h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            Des vraies personnes, de vraies clauses abusives trouvées.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
              >
                <StarRating count={t.stars} />
                <p className="text-gray-700 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">kiluna<span className="text-blue-400">.fr</span></span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Kiluna simplifie la lecture de tes contrats grâce à l'IA.
            Analyse informative — ne constitue pas un avis juridique.
          </p>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-slate-600 text-xs">
              Pour toute situation grave, consulte un avocat.
            </p>
            <p className="text-slate-700 text-xs">© {new Date().getFullYear()} kiluna.fr</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
