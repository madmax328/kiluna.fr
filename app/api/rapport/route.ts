import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session manquante" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Paiement non confirmé" }, { status: 402 });
    }

    // Generate a demo detailed report (in production, store the contract text and retrieve it)
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Génère un exemple de rapport d'analyse juridique complet en français pour un bail de location résidentielle standard.

Retourne UNIQUEMENT un JSON avec cette structure:
{
  "contractType": "Bail de location résidentielle",
  "analysisDate": "${new Date().toLocaleDateString("fr-FR")}",
  "clauses": [
    {
      "title": "titre de la clause",
      "severity": "ok" | "suspicious" | "illegal",
      "excerpt": "extrait de la clause...",
      "explanation": "explication en français simple de ce que ça veut dire",
      "rights": "tes droits dans cette situation",
      "action": "ce que tu peux faire concrètement"
    }
  ],
  "summary": "résumé global du contrat en 2-3 phrases",
  "urgentActions": ["action urgente 1", "action urgente 2"]
}

Inclus 6 clauses variées (2 ok, 2 suspicious, 2 illegal). Réponds UNIQUEMENT avec le JSON.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Réponse invalide");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format invalide");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Rapport error:", error);
    return NextResponse.json({ error: "Erreur lors de la génération du rapport" }, { status: 500 });
  }
}
