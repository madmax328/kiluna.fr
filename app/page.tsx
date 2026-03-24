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
  ArrowRight,
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
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-gray-900 pr-4 text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
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
    <div className="min-h-screen bg-white">

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-950 tracking-tight">
              kiluna<span className="text-blue-600">.fr</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Lock className="w-3 h-3" />
              Paiement sécurisé Stripe
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Colonne gauche */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full shadow-sm mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Analyse de contrats par IA · Droit français
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl font-black text-gray-950 leading-[1.05] tracking-tight mb-6">
                Ton contrat<br />
                cache-t-il des{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  clauses abusives ?
                </span>
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
                Upload ton bail, CDI, contrat freelance ou abonnement. L'IA détecte ce qui est
                suspect ou illégal — expliqué en français simple, en 60 secondes.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-0 mb-10">
                {[
                  { value: "1 sur 3", label: "contrats contient une clause abusive" },
                  { value: "60 sec", label: "pour analyser ton contrat" },
                  { value: "2,99€", label: "rapport complet et détaillé" },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex-1 ${i > 0 ? "pl-6 border-l border-gray-200" : ""} ${i < 2 ? "pr-6" : ""}`}
                  >
                    <div className="text-xl font-black text-gray-950">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust micro-signals */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><span>🔒</span> Contrat jamais stocké</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="flex items-center gap-1.5"><span>🇫🇷</span> Basé sur la loi française</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="flex items-center gap-1.5"><span>💳</span> Sans abonnement</span>
              </div>
            </div>

            {/* Colonne droite — carte upload */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/50 to-indigo-100/30 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 p-7 ring-1 ring-gray-100">

                {!preview ? (
                  <>
                    <div className="mb-5">
                      <p className="font-bold text-gray-900 text-base">Analyse ton contrat</p>
                      <p className="text-gray-400 text-sm">Gratuit · Résultat en moins de 60 secondes</p>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive
                          ? "border-blue-400 bg-blue-50 scale-[0.99]"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm">
                          <FileText className="w-4 h-4" />
                          {file.name}
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 font-semibold text-sm mb-1">
                            Glisse ton contrat ici
                          </p>
                          <p className="text-gray-400 text-xs">PDF ou TXT · 10 Mo max</p>
                        </>
                      )}
                    </div>

                    {file && (
                      <button
                        onClick={analyzeContract}
                        disabled={loading}
                        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
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
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}

                    {!file && (
                      <p className="text-center text-xs text-gray-400 mt-5">
                        Dépose ton fichier pour commencer · Sans inscription
                      </p>
                    )}

                    {error && (
                      <p className="mt-3 text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-xl p-3">
                        {error}
                      </p>
                    )}
                  </>
                ) : (
                  /* Résultats */
                  <>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Analyse terminée</p>
                        <p className="text-gray-400 text-xs">{preview.clauseCount} clauses · {file?.name}</p>
                      </div>
                    </div>

                    {/* Badges résultats */}
                    <div className="flex gap-2 mb-5">
                      <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-green-700">
                          {preview.clauseCount - preview.suspiciousCount - preview.illegalCount}
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-0.5">normales</div>
                      </div>
                      <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-amber-700">{preview.suspiciousCount}</div>
                        <div className="text-xs text-amber-600 font-medium mt-0.5">suspectes</div>
                      </div>
                      <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-red-700">{preview.illegalCount}</div>
                        <div className="text-xs text-red-600 font-medium mt-0.5">illégales</div>
                      </div>
                    </div>

                    {/* Aperçu flou */}
                    <div className="space-y-2 mb-5 relative">
                      {preview.previewClauses.map((clause, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                            clause.severity === "illegal"
                              ? "border-red-100 bg-red-50"
                              : clause.severity === "suspicious"
                              ? "border-amber-100 bg-amber-50"
                              : "border-gray-100 bg-gray-50"
                          } ${i >= 2 ? "blur-sm select-none" : ""}`}
                        >
                          <span className="font-medium text-gray-800 text-xs">{clause.title}</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              clause.severity === "illegal"
                                ? "bg-red-100 text-red-700"
                                : clause.severity === "suspicious"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {clause.severity === "illegal" ? "Illégale" : clause.severity === "suspicious" ? "Suspecte" : "Normale"}
                          </span>
                        </div>
                      ))}
                      {preview.previewClauses.length > 2 && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                      )}
                    </div>

                    <button
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 mb-3"
                    >
                      <Lock className="w-4 h-4" />
                      Voir le rapport complet — 2,99€
                    </button>
                    <button
                      onClick={() => { setPreview(null); setFile(null); }}
                      className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors font-medium"
                    >
                      Analyser un autre contrat
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Comment ça marche — section sombre ──────────────────── */}
      <section className="bg-gray-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Comment ça marche</p>
            <h2 className="text-4xl font-black text-white leading-tight">
              Simple, rapide,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                sans jargon juridique
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative group">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full hover:border-blue-500/40 transition-all duration-300">
                  <div className="text-5xl font-black text-blue-500/20 mb-5 group-hover:text-blue-500/30 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Garanties */}
          <div className="mt-16 pt-16 border-t border-gray-800 grid sm:grid-cols-4 gap-6">
            {[
              { icon: "🔒", title: "Confidentiel", desc: "Jamais stocké sur nos serveurs" },
              { icon: "⚡", title: "Instantané", desc: "Résultat en moins de 60 secondes" },
              { icon: "🇫🇷", title: "Droit français", desc: "Analyse basée sur la loi française" },
              { icon: "💳", title: "Sans abonnement", desc: "Paiement unique de 2,99€" },
            ].map((t) => (
              <div key={t.title} className="flex items-start gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{t.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Types de contrats ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Compatibilité</p>
            <h2 className="text-4xl font-black text-gray-950">Quels contrats on analyse</h2>
            <p className="text-gray-400 text-base mt-3">Tout document juridique en français est accepté.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CONTRACT_TYPES.map((c) => (
              <div
                key={c.label}
                className="group bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 cursor-default"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{c.icon}</span>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{c.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl font-black text-gray-950">Ils ont protégé leurs droits</h2>
            <p className="text-gray-400 text-base mt-3">De vraies personnes, de vraies clauses abusives trouvées.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <StarRating count={t.stars} />
                <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="border-t border-gray-100 pt-5">
                  <div className="font-bold text-gray-900 text-sm">{t.author}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-gray-950">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Prêt à vérifier ton contrat ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Analyse gratuite · Rapport complet à 2,99€ · Sans inscription
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-black px-8 py-4 rounded-2xl text-base hover:bg-blue-50 transition-colors shadow-xl shadow-blue-900/20"
          >
            <Shield className="w-5 h-5" />
            Analyser mon contrat gratuitement
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-10 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg">kiluna<span className="text-blue-400">.fr</span></span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Kiluna simplifie la lecture de tes contrats grâce à l'IA.
                Analyse informative — ne constitue pas un avis juridique.
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-semibold mb-1">Pour les cas graves</p>
              <p className="text-gray-600 text-xs">Consultez un avocat ou huissier.</p>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-gray-700 text-xs">© {new Date().getFullYear()} kiluna.fr — Tous droits réservés</p>
            <p className="text-gray-700 text-xs">Paiement sécurisé par Stripe</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
