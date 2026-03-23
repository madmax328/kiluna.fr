import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Rapport d'analyse complet",
              description: `Analyse détaillée de votre contrat${fileName ? ` : ${fileName}` : ""} — clauses suspectes, droits et recours en droit français`,
            },
            unit_amount: 299,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/rapport?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
      locale: "fr",
      metadata: { fileName: fileName || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erreur lors du paiement" }, { status: 500 });
  }
}
