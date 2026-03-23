import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const text = await file.text();
    const truncated = text.slice(0, 12000);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Tu es un expert juridique français spécialisé dans l'analyse de contrats.

Analyse ce contrat et retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "clauseCount": <nombre total de clauses identifiées>,
  "suspiciousCount": <nombre de clauses suspectes>,
  "illegalCount": <nombre de clauses potentiellement illégales>,
  "previewClauses": [
    { "title": "<titre court de la clause>", "severity": "ok" | "suspicious" | "illegal" },
    ... (liste toutes les clauses, max 8)
  ]
}

Critères:
- "ok": clause standard et légale
- "suspicious": clause inhabituelle, déséquilibrée ou potentiellement abusive
- "illegal": clause contraire au droit français (Code civil, Code du travail, loi ALUR...)

Contrat à analyser:
---
${truncated}
---

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Réponse inattendue de l'IA");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format de réponse invalide");

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
