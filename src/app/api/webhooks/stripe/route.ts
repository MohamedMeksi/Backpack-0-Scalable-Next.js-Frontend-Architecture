import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/stripe
 * Endpoint pour recevoir les événements Stripe Webhooks.
 * Configurez l'URL dans le dashboard Stripe :
 * https://dashboard.stripe.com/webhooks
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // TODO: Remplacer par votre clé secrète webhook Stripe
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    // TODO: Initialiser Stripe et vérifier la signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Exemple de gestion d'événements
    // switch (event.type) {
    //   case "checkout.session.completed":
    //     // Activer l'abonnement utilisateur
    //     break;
    //   case "invoice.payment_failed":
    //     // Notifier l'utilisateur d'un échec de paiement
    //     break;
    // }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[Stripe Webhook Error]", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
