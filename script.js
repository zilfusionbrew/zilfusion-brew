
// CONTACT NAV
function goContact() {
  showPage('contact');
}

// SLIDER LONGANI
window.addEventListener('DOMContentLoaded', function() {
  var slide1 = document.getElementById('longani-slide-1');
  var slide2 = document.getElementById('longani-slide-2');
  var dot1 = document.getElementById('longani-dot-1');
  var dot2 = document.getElementById('longani-dot-2');
  if (!slide1) return;
  var current = 1;
  var paused = false;
  setInterval(function() {
    if (paused) return;
    if (current === 1) {
      slide1.style.opacity = '0'; slide2.style.opacity = '1';
      dot1.style.opacity = '.3'; dot2.style.opacity = '1';
      current = 2;
    } else {
      slide1.style.opacity = '1'; slide2.style.opacity = '0';
      dot1.style.opacity = '1'; dot2.style.opacity = '.3';
      current = 1;
    }
  }, 3500);
  window.toggleLonganiSlider = function() {
    paused = !paused;
    var icon = document.getElementById('longani-pause-icon');
    icon.style.display = paused ? 'block' : 'none';
    icon.textContent = '▶ REPRENDRE';
  };

  // SLIDER FRUITS DU DRAGON
  var ds1 = document.getElementById('dragon-slide-1');
  var ds2 = document.getElementById('dragon-slide-2');
  var ds3 = document.getElementById('dragon-slide-3');
  var dd1 = document.getElementById('dragon-dot-1');
  var dd2 = document.getElementById('dragon-dot-2');
  var dd3 = document.getElementById('dragon-dot-3');
  if (!ds1) return;
  var dcurrent = 1;
  var dpaused = false;
  setInterval(function() {
    if (dpaused) return;
    ds1.style.opacity = '0'; ds2.style.opacity = '0'; ds3.style.opacity = '0';
    dd1.style.opacity = '.3'; dd2.style.opacity = '.3'; dd3.style.opacity = '.3';
    dcurrent = dcurrent === 3 ? 1 : dcurrent + 1;
    if (dcurrent === 1) { ds1.style.opacity = '1'; dd1.style.opacity = '1'; }
    if (dcurrent === 2) { ds2.style.opacity = '1'; dd2.style.opacity = '1'; }
    if (dcurrent === 3) { ds3.style.opacity = '1'; dd3.style.opacity = '1'; }
  }, 3500);
  window.toggleDragonSlider = function() {
    dpaused = !dpaused;
    var icon = document.getElementById('dragon-pause-icon');
    icon.style.display = dpaused ? 'block' : 'none';
    icon.textContent = '▶ REPRENDRE';
  };
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  var el = document.getElementById('nav-' + id);
  if (el) el.classList.add('active');
  closeAllDropdowns();
  window.scrollTo(0, 0);
}
function closeAllDropdowns() {
  document.querySelectorAll('.has-drop').forEach(function(li) { li.classList.remove('open'); });
}
var dropdownTimer = null;
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.has-drop').forEach(function(li) {
    // Ouvrir au clic
    li.querySelector('a').addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = li.classList.contains('open');
      closeAllDropdowns();
      clearTimeout(dropdownTimer);
      if (!isOpen) li.classList.add('open');
    });
    // Fermer dès que la souris quitte le menu
    li.addEventListener('mouseleave', function() {
      clearTimeout(dropdownTimer);
      li.classList.remove('open');
    });
  });
  // Fermer quand on clique sur un lien dans le dropdown
  document.querySelectorAll('.dropdown a').forEach(function(a) {
    a.addEventListener('click', function() { closeAllDropdowns(); });
  });
  // Fermer en cliquant ailleurs
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-drop')) closeAllDropdowns();
  });
});
// Init site + age gate — un seul DOMContentLoaded pour éviter le flash
window.addEventListener('DOMContentLoaded', function() {
  // 1. Afficher la bonne page EN PREMIER (avant tout le reste)
  var _hash = window.location.hash.replace('#','');
  var _pages = ['bieres','rhum','fermentees','sodas','hardkombucha','ateliers','contact','histoire','apropos'];
  if (_hash && _pages.indexOf(_hash) !== -1) { showPage(_hash); } else { showPage('accueil'); }

  // 2. Age gate
  const ageGate = document.getElementById('ageGate');
  if (ageGate) {
    const isVerified = sessionStorage.getItem('ageVerified');
    ageGate.style.display = (isVerified === 'true') ? 'none' : 'flex';
  }

  // 3. Reste
  document.querySelectorAll('.si').forEach(function(el) { el.style.flexDirection = 'column'; });
  updateCartUI();
  if (window.location.hash === '#cart') { openCart(); history.replaceState(null,'',window.location.pathname); }
});

function enterSite() {
  sessionStorage.setItem('ageVerified', 'true');
  const ageGate = document.getElementById('ageGate');
  if (ageGate) ageGate.style.display = 'none';
}
function switchTab(id, btn) {
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  var panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
}
function switchTabById(subId) {
  var parentTab = subId.indexOf('kombucha') === 0 ? 'kombucha' : subId.indexOf('kefir') === 0 ? 'kefir' : 'sodas';
  var btn = document.getElementById('tabBtn-' + parentTab);
  if (btn) switchTab(parentTab, btn);
  setTimeout(function() {
    var card = document.querySelector('[data-ferm="' + subId + '"]');
    if (card) {
      card.scrollIntoView({behavior:'smooth', block:'center'});
      card.style.outline = '2px solid var(--gold)';
      setTimeout(function(){ card.style.outline=''; }, 2000);
    }
  }, 200);
}
var cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
function saveCart() { sessionStorage.setItem('cart', JSON.stringify(cart)); }
var CHECKOUT_PRODUCT_IDS = {
  'Coffret Rumtopf Premium|8900': 'coffret-rumtopf',
  'Coffret Découverte|4900': 'coffret-decouverte',
  'Coffret Signature|7900': 'coffret-signature',
  'Pack Vanille & Rhum|4500': 'pack-vanille-rhum',
  'Vanille Madagascar Découverte|1500': 'vanille-decouverte',
  'Cola Artisanal|390': 'cola-artisanal',
  'Soda Citron Vert|390': 'soda-citron-vert-premium',
  'Soda Orange Passion|390': 'soda-orange-passion',
  'Pack Soda Découverte|1090': 'pack-soda-decouverte',
  'Shooter gravé ZilFusion Brew|300': 'shooter-grave-index',
  'Verre longdrink gravé ZilFusion Brew|800': 'longdrink-grave-index',
  'Verre tulipe dégustation ZilFusion Brew|1000': 'tulipe-grave-index',
  'Pale Ale Mango|450': 'pale-ale-mango',
  'IPA Tropicale|450': 'ipa-tropicale',
  'Stout Cacao|520': 'stout-cacao',
  'Blonde Passion|400': 'blonde-passion',
  'Saison Hibiscus|750': 'saison-hibiscus',
  'Sour Citron Vert|500': 'sour-citron-vert',
  'Porter Vanille|550': 'porter-vanille',
  'Griotika Cherry Stout|250': 'griotika-cherry-stout',
  'Rhum Vanille-Coco|2490': 'rhum-vanille-coco',
  'Rhum Gingembre-Citron|2290': 'rhum-gingembre-citron',
  'Rhum Fruits Rouges|2990': 'rhum-fruits-rouges',
  'Rhum Épices Créoles|2590': 'rhum-epices-creoles',
  'Rhum Longani|3500': 'rhum-longani',
  'Rhum Fruits du Dragon, Passion & Combava|3500': 'rhum-fruits-dragon',
  'Rhum arrangé Mangue|3500': 'rhum-mangue',
  'Rumtopf Signature|4900': 'rumtopf-signature',
  'Kombucha Hibiscus|690': 'kombucha-hibiscus',
  'Kombucha Gingembre|690': 'kombucha-gingembre',
  'Kombucha Citron-Kaffir|720': 'kombucha-citron-kaffir',
  'Kéfir Lait Nature|450': 'kefir-lait-nature',
  'Kéfir de Lait Nature|450': 'kefir-de-lait-nature',
  'Kéfir Fruits Tropicaux|520': 'kefir-fruits-tropicaux',
  'Kéfir Fruits Hibiscus|480': 'kefir-fruits-hibiscus',
  'Soda Passion-Menthe|320': 'soda-passion-menthe',
  'Soda Ananas-Basilic|320': 'soda-ananas-basilic',
  'Soda Goyave-Lime|350': 'soda-goyave-lime',
  'Koso Ananas-Gingembre|890': 'koso-ananas-gingembre',
  'Koso Hibiscus-Fruits Rouges|890': 'koso-hibiscus-fruits-rouges',
  'Koso Citron-Kaffir-Menthe|890': 'koso-citron-kaffir-menthe',
  'Rumtopf Fruits Tropicaux|1890': 'rumtopf-fruits-tropicaux',
  'Rumtopf Griotte & Vanille|2190': 'rumtopf-griotte-vanille',
  'Rumtopf Épices Créoles|1990': 'rumtopf-epices-creoles',
  'Mini flacon rhum 3cl|300': 'mini-flacon-rhum-3cl',
  'Mini flacon rhum 5cl|500': 'mini-flacon-rhum-5cl',
  'Box Découverte|3200': 'box-decouverte-3200',
  'Box Découverte|3900': 'box-decouverte-3900',
  'Box Brasseur|2800': 'box-brasseur-2800',
  'Box Brasseur|2900': 'box-brasseur-2900',
  'Box Rhum & Bière|5800': 'box-rhum-biere-5800',
  'Box Rhum & Bière|5900': 'box-rhum-biere-5900',
  'Gingembre séché|450': 'gingembre-seche',
  'Mélange Épices Créoles|690': 'epices-creoles',
  'Thé vert Bio Sencha|550': 'the-sencha',
  'Scoby Kombucha|990': 'scoby-kombucha',
  'Grains Kéfir|790': 'grains-kefir',
  'Kit Embouteillage|2490': 'kit-embouteillage',
  'Bocal Hermétique 1L|690': 'bocal-hermetique',
  'Shooter Gravé Zil Fusion Brew|300': 'shooter-grave',
  'Pack 2 Shooters Gravés Zil Fusion Brew|600': 'pack-2-shooters-graves',
  'Pack 4 Shooters Gravés Zil Fusion Brew|1200': 'pack-4-shooters-graves',
  'Verre Tulipe Gravé Zil Fusion Brew|800': 'verre-tulipe-grave',
  'Pack 2 Verres Tulipe Gravés Zil Fusion Brew|1500': 'pack-2-verres-tulipe',
  'Pack 4 Verres Tulipe Gravés Zil Fusion Brew|2800': 'pack-4-verres-tulipe',
  'Verre Longdrink Gravé Zil Fusion Brew|800': 'verre-longdrink-grave',
  'Pack 2 Verres Longdrink Gravés Zil Fusion Brew|1500': 'pack-2-verres-longdrink',
  'Pack 4 Verres Longdrink Gravés Zil Fusion Brew|2800': 'pack-4-verres-longdrink',
  'Verre à Bière Gravé Zil Fusion Brew|800': 'verre-biere-grave',
  'Pack 2 Verres à Bière Gravés Zil Fusion Brew|1500': 'pack-2-verres-biere',
  'Pack 4 Verres à Bière Gravés Zil Fusion Brew|2800': 'pack-4-verres-biere',
  'Coffret découverte premium ZilFusion Brew|3500': 'coffret-decouverte-premium-verres',
  'Coffret rhum arrangé ZilFusion Brew|5900': 'coffret-rhum-arrange-verres'
};
function cents(price) { return Math.round(Number(price) * 100); }
function checkoutProductId(name, price) {
  return CHECKOUT_PRODUCT_IDS[name + '|' + cents(price)];
}
function addToCart(name, price, sub) {
  var id = null;
  if (typeof price === 'string' && typeof sub === 'number') {
    id = name;
    name = price;
    price = sub;
    sub = '';
  }
  id = id || checkoutProductId(name, price);
  var e = cart.find(function(i) { return i.name === name; });
  if (e) {
    e.qty++;
    if (!e.id && id) e.id = id;
  } else {
    cart.push({id:id, name:name, price:price, sub:sub||'', qty:1});
  }
  saveCart(); updateCartUI(); showToast('+ ' + name + ' ajouté'); openCart();
}
function removeFromCart(name) {
  cart = cart.filter(function(i) { return i.name !== name; });
  saveCart(); updateCartUI(); renderCart();
}
function updateCartUI() {
  var cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  var count = cart.reduce(function(s,i){return s+i.qty;},0);
  var sousTotal = cart.reduce(function(s,i){return s+(i.price*i.qty);},0);
  var livraison = sousTotal >= 60 ? 0 : 5.90;
  var total = sousTotal + livraison;
  document.getElementById('cartCount').textContent = count;
  var ship = document.getElementById('shipCost');
  if (ship) {
    if (livraison === 0) { ship.textContent = 'Gratuite ✓'; ship.className = 'free'; }
    else { ship.textContent = '5,90 € (gratuit dès 60€)'; ship.style.color = 'var(--dim)'; }
  }
  var totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = total.toFixed(2).replace('.',',') + ' €';
}
function renderCart() {
  cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  var el = document.getElementById('cartBody');
  el.replaceChildren();
  if (!cart.length) {
    var empty = document.createElement('p');
    empty.className = 'c-empty';
    empty.textContent = 'Votre panier est vide.';
    el.appendChild(empty);
    return;
  }
  cart.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'citem';
    var total = (item.price * item.qty).toFixed(2).replace('.', ',');

    var info = document.createElement('div');
    var name = document.createElement('p');
    name.className = 'name';
    name.textContent = item.name;

    var sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = (item.sub || '') + ' · Qté: ' + item.qty;

    var right = document.createElement('div');
    right.className = 'citem-r';
    var price = document.createElement('span');
    price.className = 'citem-p';
    price.textContent = total + '€';

    var btn = document.createElement('button');
    btn.className = 'crm';
    btn.textContent = '×';
    btn.addEventListener('click', (function(name){ return function(){ removeFromCart(name); }; })(item.name));

    info.appendChild(name);
    info.appendChild(sub);
    right.appendChild(price);
    right.appendChild(btn);
    div.appendChild(info);
    div.appendChild(right);
    el.appendChild(div);
  });
}
function openCart() { renderCart(); updateCartUI(); document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('active'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('active'); }
// ─── CHECKOUT ────────────────────────────────────────────────────────────────
// La clé secrète Stripe est UNIQUEMENT dans Netlify > Environment Variables
// Variable : STRIPE_SECRET_KEY
// Ne jamais mettre la clé secrète ici.

function checkout() {
  var cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  if (!cart.length) { showToast('Votre panier est vide !'); return; }
  var checkoutItems = [];
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var id = item.id || checkoutProductId(item.name, item.price);
    var quantity = Number(item.qty);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      showToast('Panier invalide : produit non reconnu');
      return;
    }
    checkoutItems.push({id:id, quantity:quantity});
  }

  // Désactiver le bouton pendant la requête
  var btn = document.querySelector('.c-checkout');
  if (btn) { btn.disabled = true; btn.textContent = 'Chargement…'; }

  fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: checkoutItems })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Paiement indisponible');
      if (btn) { btn.disabled = false; btn.textContent = 'Procéder au paiement 🔒'; }
    }
  })
  .catch(function() {
    alert('Paiement indisponible');
    if (btn) { btn.disabled = false; btn.textContent = 'Procéder au paiement 🔒'; }
  });
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}
// ─────────────────────────────────────────────────────────────────────────────


function viderPanier() {
  sessionStorage.removeItem('cart');
  cart = [];
  updateCartUI();
  renderCart();
}
function filterShop(cat, btn) { filterShopCat(cat, btn); }
function filterShopCat(cat, btn) {
  document.querySelectorAll('.fbtn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  var count = 0;
  document.querySelectorAll('.si').forEach(function(item){
    var c1 = item.dataset.cat || '';
    var c2 = item.dataset.cat2 || '';
    var show = cat === 'all'
      || c1 === cat
      || c2 === cat
      || (cat === 'fermentation' && (c1 === 'kombucha' || c1 === 'kefir' || c1 === 'soda'));
    item.style.display = show ? 'flex' : 'none';
    if(show) count++;
  });
  var sc = document.getElementById('shopCount');
  if(sc) sc.textContent = count + ' produit' + (count > 1 ? 's' : '');
}
function filterBieres(s){} function filterRhum(s){}
function selectAtelier(name) {
  showPage('ateliers');
  setTimeout(function(){
    var form = document.getElementById('atelierSelect');
    if(!form) return;
    form.scrollIntoView({behavior:'smooth',block:'center'});
    var kw = name.toLowerCase();
    for(var i=0;i<form.options.length;i++){
      if(form.options[i].text.toLowerCase().indexOf(kw.split(' ').slice(1,3).join(' '))>-1){form.options[i].selected=true;break;}
    }
  }, 450);
}
function handleForm(e) { e.preventDefault(); showToast('Message envoyé - Réponse sous 24h !'); e.target.reset(); }

function openLonganiModal() {
  var m = document.getElementById('longaniModal');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
  document.body.style.overflow = 'hidden';
}
function closeLonganiModal() {
  var m = document.getElementById('longaniModal');
  m.style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLonganiModal(); });

function openRhumModal() {
  var m = document.getElementById('rhumModal');
  m.style.display = 'flex';
  m.style.alignItems = 'flex-start';
  m.style.justifyContent = 'center';
  document.body.style.overflow = 'hidden';
}
function closeRhumModal() {
  var m = document.getElementById('rhumModal');
  m.style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeRhumModal(); });

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},2500);
}
window.addEventListener('scroll', function(){
  document.getElementById('navbar').style.borderBottomColor = window.scrollY>40 ? 'rgba(197,160,89,.28)' : 'rgba(197,160,89,.12)';
});

/* ══ PAYMENT MODAL ══ */
var currentPayMethod = 'card';
var currentLivr = 'std';
var livrCosts = {std: 5.90, exp: 12.90, ret: 0};

function getCartTotal() {
  return cart.reduce(function(s,i){return s+(i.price*i.qty);},0);
}
function getCartSummary() {
  return cart.map(function(i){return i.qty+'x '+i.name+' ('+i.price.toFixed(2).replace('.',',')+'€)';}).join('\n');
}
function getLivrCost() {
  var sub = getCartTotal();
  if (currentLivr === 'ret') return 0;
  return sub >= 60 ? 0 : livrCosts[currentLivr];
}
function getFinalTotal() {
  return getCartTotal() + getLivrCost();
}
function fmt(n){ return n.toFixed(2).replace('.',',') + ' €'; }

function openPaymentModal() {
  if (!cart.length) { showToast('Votre panier est vide !'); return; }
  closeCart();
  var sub = getCartTotal();
  document.getElementById('paymentModal').style.display = 'none';
  document.getElementById('successModal').style.display = 'flex';
  cart = [];
  saveCart();
  updateCartUI();
}

// GESTION STOCK
document.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem('zilf_promos');
  if (!saved) return;
  const promos = JSON.parse(saved);
  
  Object.entries(promos).forEach(function([pid, promo]) {
    if (promo.stock === null || promo.stock === undefined) return;
    
    const els = document.querySelectorAll('[data-pid="'+pid+'"]');
    els.forEach(function(el) {
      // Trouver le bouton ajouter au panier
      const btn = el.querySelector('.btn-add');
      
      // Créer badge stock
      const existing = el.querySelector('.zilf-stock-badge');
      if (existing) existing.remove();
      
      const badge = document.createElement('p');
      badge.className = 'zilf-stock-badge';
      badge.style.cssText = 'font-size:.7rem;font-weight:700;margin-bottom:.4rem;';
      
      if (promo.stock === 0) {
        badge.textContent = '❌ Rupture de stock';
        badge.style.color = '#e05555';
        if (btn) { btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed'; }
      } else if (promo.stock <= 10) {
        badge.textContent = '⚡ Plus que ' + promo.stock + ' en stock !';
        badge.style.color = '#e07c35';
      } else {
        badge.textContent = '✅ En stock — ' + promo.stock + ' bouteilles';
        badge.style.color = '#4caf7d';
      }
      
      if (btn) btn.parentNode.insertBefore(badge, btn);
    });
  });
});
