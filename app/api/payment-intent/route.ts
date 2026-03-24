import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { fileName } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 299,
      currency: "eur",
      payment_method_types: ["card"],
      metadata: { fileName: fileName || "" },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("PaymentIntent error:", error);
    return NextResponse.json(
      { error: "Impossible de créer le paiement" },
      { status: 500 }
    );
  }
}
