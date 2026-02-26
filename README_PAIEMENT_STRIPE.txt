Zil Fusion Brew — Paiement Stripe (Netlify)

✅ Paiement réel activé via Stripe Checkout (Netlify Functions)

1) Déployer sur Netlify
- Drag & drop le dossier (ou via Git)

2) Dans Netlify > Site configuration > Environment variables, ajouter :
- STRIPE_SECRET_KEY = (ta clé secrète Stripe)
- SITE_URL = https://TON-SITE.netlify.app  (ou ton domaine)

3) Tester
- Ajoute un produit au panier
- Va sur commande.html
- Clique "Payer par carte"

Notes
- Les prix sont verrouillés côté serveur dans netlify/functions/create-checkout-session.js (CATALOG).
- Pour ajouter des produits: ajouter le data-id dans boutique.html + ajouter l'entrée dans CATALOG.
