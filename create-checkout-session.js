const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRODUCT_CATALOG = {
  'coffret-rumtopf': { id: 'coffret-rumtopf', name: 'Coffret Rumtopf Premium', unit_amount: 8900, currency: 'eur' },
  'coffret-decouverte': { id: 'coffret-decouverte', name: 'Coffret Découverte', unit_amount: 4900, currency: 'eur' },
  'coffret-signature': { id: 'coffret-signature', name: 'Coffret Signature', unit_amount: 7900, currency: 'eur' },
  'pack-vanille-rhum': { id: 'pack-vanille-rhum', name: 'Pack Vanille & Rhum', unit_amount: 4500, currency: 'eur' },
  'vanille-decouverte': { id: 'vanille-decouverte', name: 'Vanille Madagascar Découverte', unit_amount: 1500, currency: 'eur' },
  'cola-artisanal': { id: 'cola-artisanal', name: 'Cola Artisanal', unit_amount: 390, currency: 'eur' },
  'soda-citron-vert': { id: 'soda-citron-vert', name: 'Soda Citron Vert', unit_amount: 390, currency: 'eur' },
  'soda-citron-vert-premium': { id: 'soda-citron-vert-premium', name: 'Soda Citron Vert', unit_amount: 390, currency: 'eur' },
  'soda-orange-passion': { id: 'soda-orange-passion', name: 'Soda Orange Passion', unit_amount: 390, currency: 'eur' },
  'pack-soda-decouverte': { id: 'pack-soda-decouverte', name: 'Pack Soda Découverte', unit_amount: 1090, currency: 'eur' },
  'shooter-grave-index': { id: 'shooter-grave-index', name: 'Shooter gravé ZilFusion Brew', unit_amount: 300, currency: 'eur' },
  'longdrink-grave': { id: 'longdrink-grave', name: 'Verre longdrink gravé ZilFusion Brew', unit_amount: 800, currency: 'eur' },
  'longdrink-grave-index': { id: 'longdrink-grave-index', name: 'Verre longdrink gravé ZilFusion Brew', unit_amount: 800, currency: 'eur' },
  'tulipe-grave': { id: 'tulipe-grave', name: 'Verre tulipe dégustation ZilFusion Brew', unit_amount: 1000, currency: 'eur' },
  'tulipe-grave-index': { id: 'tulipe-grave-index', name: 'Verre tulipe dégustation ZilFusion Brew', unit_amount: 1000, currency: 'eur' },

  'pale-ale-mango': { id: 'pale-ale-mango', name: 'Pale Ale Mango', unit_amount: 450, currency: 'eur' },
  'ipa-tropicale': { id: 'ipa-tropicale', name: 'IPA Tropicale', unit_amount: 450, currency: 'eur' },
  'stout-cacao': { id: 'stout-cacao', name: 'Stout Cacao', unit_amount: 520, currency: 'eur' },
  'blonde-passion': { id: 'blonde-passion', name: 'Blonde Passion', unit_amount: 400, currency: 'eur' },
  'saison-hibiscus': { id: 'saison-hibiscus', name: 'Saison Hibiscus', unit_amount: 750, currency: 'eur' },
  'sour-citron-vert': { id: 'sour-citron-vert', name: 'Sour Citron Vert', unit_amount: 500, currency: 'eur' },
  'porter-vanille': { id: 'porter-vanille', name: 'Porter Vanille', unit_amount: 550, currency: 'eur' },
  'griotika-cherry-stout': { id: 'griotika-cherry-stout', name: 'Griotika Cherry Stout', unit_amount: 250, currency: 'eur' },

  'rhum-vanille-coco': { id: 'rhum-vanille-coco', name: 'Rhum Vanille-Coco', unit_amount: 2490, currency: 'eur' },
  'rhum-gingembre-citron': { id: 'rhum-gingembre-citron', name: 'Rhum Gingembre-Citron', unit_amount: 2290, currency: 'eur' },
  'rhum-fruits-rouges': { id: 'rhum-fruits-rouges', name: 'Rhum Fruits Rouges', unit_amount: 2990, currency: 'eur' },
  'rhum-epices-creoles': { id: 'rhum-epices-creoles', name: 'Rhum Épices Créoles', unit_amount: 2590, currency: 'eur' },
  'rhum-longani': { id: 'rhum-longani', name: 'Rhum Longani', unit_amount: 3500, currency: 'eur' },
  'rhum-fruits-dragon': { id: 'rhum-fruits-dragon', name: 'Rhum Fruits du Dragon, Passion & Combava', unit_amount: 3500, currency: 'eur' },
  'rhum-mangue': { id: 'rhum-mangue', name: 'Rhum arrangé Mangue', unit_amount: 3500, currency: 'eur' },
  'rumtopf-signature': { id: 'rumtopf-signature', name: 'Rumtopf Signature', unit_amount: 4900, currency: 'eur' },

  'kombucha-hibiscus': { id: 'kombucha-hibiscus', name: 'Kombucha Hibiscus', unit_amount: 690, currency: 'eur' },
  'kombucha-gingembre': { id: 'kombucha-gingembre', name: 'Kombucha Gingembre', unit_amount: 690, currency: 'eur' },
  'kombucha-citron-kaffir': { id: 'kombucha-citron-kaffir', name: 'Kombucha Citron-Kaffir', unit_amount: 720, currency: 'eur' },
  'kefir-lait-nature': { id: 'kefir-lait-nature', name: 'Kéfir Lait Nature', unit_amount: 450, currency: 'eur' },
  'kefir-de-lait-nature': { id: 'kefir-de-lait-nature', name: 'Kéfir de Lait Nature', unit_amount: 450, currency: 'eur' },
  'kefir-fruits-tropicaux': { id: 'kefir-fruits-tropicaux', name: 'Kéfir Fruits Tropicaux', unit_amount: 520, currency: 'eur' },
  'kefir-fruits-hibiscus': { id: 'kefir-fruits-hibiscus', name: 'Kéfir Fruits Hibiscus', unit_amount: 480, currency: 'eur' },
  'soda-passion-menthe': { id: 'soda-passion-menthe', name: 'Soda Passion-Menthe', unit_amount: 320, currency: 'eur' },
  'soda-ananas-basilic': { id: 'soda-ananas-basilic', name: 'Soda Ananas-Basilic', unit_amount: 320, currency: 'eur' },
  'soda-goyave-lime': { id: 'soda-goyave-lime', name: 'Soda Goyave-Lime', unit_amount: 350, currency: 'eur' },
  'koso-ananas-gingembre': { id: 'koso-ananas-gingembre', name: 'Koso Ananas-Gingembre', unit_amount: 890, currency: 'eur' },
  'koso-hibiscus-fruits-rouges': { id: 'koso-hibiscus-fruits-rouges', name: 'Koso Hibiscus-Fruits Rouges', unit_amount: 890, currency: 'eur' },
  'koso-citron-kaffir-menthe': { id: 'koso-citron-kaffir-menthe', name: 'Koso Citron-Kaffir-Menthe', unit_amount: 890, currency: 'eur' },
  'rumtopf-fruits-tropicaux': { id: 'rumtopf-fruits-tropicaux', name: 'Rumtopf Fruits Tropicaux', unit_amount: 1890, currency: 'eur' },
  'rumtopf-griotte-vanille': { id: 'rumtopf-griotte-vanille', name: 'Rumtopf Griotte & Vanille', unit_amount: 2190, currency: 'eur' },
  'rumtopf-epices-creoles': { id: 'rumtopf-epices-creoles', name: 'Rumtopf Épices Créoles', unit_amount: 1990, currency: 'eur' },

  'hk-ginger-lime': { id: 'hk-ginger-lime', name: 'Hard Kombucha Ginger Lime', unit_amount: 450, currency: 'eur' },
  'hk-pineapple-basil': { id: 'hk-pineapple-basil', name: 'Hard Kombucha Pineapple Basil', unit_amount: 450, currency: 'eur' },
  'hk-passion-mint': { id: 'hk-passion-mint', name: 'Hard Kombucha Passion Mint', unit_amount: 450, currency: 'eur' },
  'hk-berry-hibiscus': { id: 'hk-berry-hibiscus', name: 'Hard Kombucha Berry Hibiscus', unit_amount: 450, currency: 'eur' },
  'hk-citron-vert': { id: 'hk-citron-vert', name: 'Hard Kombucha Citron Vert', unit_amount: 450, currency: 'eur' },
  'hk-pack-decouverte': { id: 'hk-pack-decouverte', name: 'Pack Hard Kombucha 5 saveurs', unit_amount: 2000, currency: 'eur' },

  'mini-flacon-rhum-3cl': { id: 'mini-flacon-rhum-3cl', name: 'Mini flacon rhum 3cl', unit_amount: 300, currency: 'eur' },
  'mini-flacon-rhum-5cl': { id: 'mini-flacon-rhum-5cl', name: 'Mini flacon rhum 5cl', unit_amount: 500, currency: 'eur' },

  'box-decouverte-3200': { id: 'box-decouverte-3200', name: 'Box Découverte', unit_amount: 3200, currency: 'eur' },
  'box-decouverte-3900': { id: 'box-decouverte-3900', name: 'Box Découverte', unit_amount: 3900, currency: 'eur' },
  'box-brasseur-2800': { id: 'box-brasseur-2800', name: 'Box Brasseur', unit_amount: 2800, currency: 'eur' },
  'box-brasseur-2900': { id: 'box-brasseur-2900', name: 'Box Brasseur', unit_amount: 2900, currency: 'eur' },
  'box-rhum-biere-5800': { id: 'box-rhum-biere-5800', name: 'Box Rhum & Bière', unit_amount: 5800, currency: 'eur' },
  'box-rhum-biere-5900': { id: 'box-rhum-biere-5900', name: 'Box Rhum & Bière', unit_amount: 5900, currency: 'eur' },

  'gingembre-seche': { id: 'gingembre-seche', name: 'Gingembre séché', unit_amount: 450, currency: 'eur' },
  'epices-creoles': { id: 'epices-creoles', name: 'Mélange Épices Créoles', unit_amount: 690, currency: 'eur' },
  'the-sencha': { id: 'the-sencha', name: 'Thé vert Bio Sencha', unit_amount: 550, currency: 'eur' },
  'scoby-kombucha': { id: 'scoby-kombucha', name: 'Scoby Kombucha', unit_amount: 990, currency: 'eur' },
  'grains-kefir': { id: 'grains-kefir', name: 'Grains Kéfir', unit_amount: 790, currency: 'eur' },
  'kit-embouteillage': { id: 'kit-embouteillage', name: 'Kit Embouteillage', unit_amount: 2490, currency: 'eur' },
  'bocal-hermetique': { id: 'bocal-hermetique', name: 'Bocal Hermétique 1L', unit_amount: 690, currency: 'eur' },

  'shooter-grave': { id: 'shooter-grave', name: 'Shooter Gravé Zil Fusion Brew', unit_amount: 300, currency: 'eur' },
  'pack-2-shooters-graves': { id: 'pack-2-shooters-graves', name: 'Pack 2 Shooters Gravés Zil Fusion Brew', unit_amount: 600, currency: 'eur' },
  'pack-4-shooters-graves': { id: 'pack-4-shooters-graves', name: 'Pack 4 Shooters Gravés Zil Fusion Brew', unit_amount: 1200, currency: 'eur' },
  'verre-tulipe-grave': { id: 'verre-tulipe-grave', name: 'Verre Tulipe Gravé Zil Fusion Brew', unit_amount: 800, currency: 'eur' },
  'pack-2-verres-tulipe': { id: 'pack-2-verres-tulipe', name: 'Pack 2 Verres Tulipe Gravés Zil Fusion Brew', unit_amount: 1500, currency: 'eur' },
  'pack-4-verres-tulipe': { id: 'pack-4-verres-tulipe', name: 'Pack 4 Verres Tulipe Gravés Zil Fusion Brew', unit_amount: 2800, currency: 'eur' },
  'verre-longdrink-grave': { id: 'verre-longdrink-grave', name: 'Verre Longdrink Gravé Zil Fusion Brew', unit_amount: 800, currency: 'eur' },
  'pack-2-verres-longdrink': { id: 'pack-2-verres-longdrink', name: 'Pack 2 Verres Longdrink Gravés Zil Fusion Brew', unit_amount: 1500, currency: 'eur' },
  'pack-4-verres-longdrink': { id: 'pack-4-verres-longdrink', name: 'Pack 4 Verres Longdrink Gravés Zil Fusion Brew', unit_amount: 2800, currency: 'eur' },
  'verre-biere-grave': { id: 'verre-biere-grave', name: 'Verre à Bière Gravé Zil Fusion Brew', unit_amount: 800, currency: 'eur' },
  'pack-2-verres-biere': { id: 'pack-2-verres-biere', name: 'Pack 2 Verres à Bière Gravés Zil Fusion Brew', unit_amount: 1500, currency: 'eur' },
  'pack-4-verres-biere': { id: 'pack-4-verres-biere', name: 'Pack 4 Verres à Bière Gravés Zil Fusion Brew', unit_amount: 2800, currency: 'eur' },
  'coffret-decouverte-premium-verres': { id: 'coffret-decouverte-premium-verres', name: 'Coffret découverte premium ZilFusion Brew', unit_amount: 3500, currency: 'eur' },
  'coffret-rhum-arrange-verres': { id: 'coffret-rhum-arrange-verres', name: 'Coffret rhum arrangé ZilFusion Brew', unit_amount: 5900, currency: 'eur' },
};

function parseCheckoutItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('Panier vide');
  }

  return rawItems.map(function(item) {
    const product = PRODUCT_CATALOG[item && item.id];
    const quantity = Number(item && item.quantity);

    if (!product) {
      throw new Error('Produit inconnu');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error('Quantité invalide');
    }

    return { product: product, quantity: quantity };
  });
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let checkoutItems;
  try {
    const body = JSON.parse(event.body || '{}');
    checkoutItems = parseCheckoutItems(body.items);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Panier invalide : ' + err.message }) };
  }

  const line_items = checkoutItems.map(function(item) {
    return {
      price_data: {
        currency: item.product.currency,
        product_data: {
          name: item.product.name + ' — ZilFusion Brew',
          description: 'Produit artisanal ZilFusion Brew',
        },
        unit_amount: item.product.unit_amount,
      },
      quantity: item.quantity,
    };
  });

  const sousTotal = checkoutItems.reduce(function(sum, item) {
    return sum + (item.product.unit_amount * item.quantity);
  }, 0);
  const livraisonGratuite = sousTotal >= 6000;

  const shipping_options = livraisonGratuite
    ? [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'eur' },
          display_name: 'Livraison offerte',
          delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
        },
      }]
    : [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 590, currency: 'eur' },
          display_name: 'Livraison standard',
          delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
        },
      }];

  const siteUrl = process.env.URL || 'https://zilfusion.netlify.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      shipping_options: shipping_options,
      success_url: siteUrl + '/success.html',
      cancel_url: siteUrl + '/cancel.html',
      locale: 'fr',
      shipping_address_collection: {
        allowed_countries: ['FR', 'MU', 'MG', 'RE', 'GP', 'MQ', 'GF'],
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur Stripe : ' + err.message }),
    };
  }
};
