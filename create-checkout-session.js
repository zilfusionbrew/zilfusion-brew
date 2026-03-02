// Netlify Function — Stripe Checkout
// Configure env vars on Netlify:
// - STRIPE_SECRET_KEY
// - SITE_URL (ex: https://zilfusionbrew.netlify.app)

const Stripe = require('stripe');

const CATALOG = {
  "ipa-tropical": { name: "Tropical Craft IPA", unit_amount: 490, currency: "eur" },
  "rhum-mangue-vanille": { name: "Rhum arrangé — Mangue / Vanille", unit_amount: 2490, currency: "eur" },
  "pale-ale-mango-33cl": { name: "Mango Pale Ale — 33 cl", unit_amount: 250, currency: "eur" }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.SITE_URL;

    if (!stripeKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "STRIPE_SECRET_KEY manquante" }) };
    }
    if (!siteUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: "SITE_URL manquante" }) };
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

    const payload = JSON.parse(event.body || "{}");
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!items.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Panier vide" }) };
    }

    const line_items = [];
    for (const it of items) {
      const id = String(it.id || "").trim();
      const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
      const p = CATALOG[id];
      if (!p) continue;

      line_items.push({
        quantity: qty,
        price_data: {
          currency: p.currency,
          unit_amount: p.unit_amount,
          product_data: { name: p.name }
        }
      });
    }

    if (!line_items.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Aucun produit valide" }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${siteUrl}/merci.html?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/panier.html`,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ["FR"] }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Erreur serveur Stripe" })
    };
  }
};
