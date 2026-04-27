
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
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.si').forEach(function(el) { el.style.flexDirection = 'column'; });
  showPage('accueil');
});
function enterSite() { document.getElementById('ageGate').style.display = 'none'; }
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
var cart = [];
function addToCart(name, price, sub) {
  var e = cart.find(function(i) { return i.name === name; });
  if (e) e.qty++; else cart.push({name:name, price:price, sub:sub||'', qty:1});
  updateCartUI(); showToast('+ ' + name + ' ajouté'); openCart();
}
function removeFromCart(name) {
  cart = cart.filter(function(i) { return i.name !== name; });
  updateCartUI(); renderCart();
}
function updateCartUI() {
  var count = cart.reduce(function(s,i){return s+i.qty;},0);
  var total = cart.reduce(function(s,i){return s+(i.price*i.qty);},0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total.toFixed(2).replace('.',',') + ' €';
  var ship = document.getElementById('shipCost');
  if (total >= 60) { ship.textContent = 'Gratuite ✓'; ship.className='free'; }
  else { ship.textContent = '5,90 € (gratuit dès 60€)'; ship.style.color='var(--dim)'; }
}
function renderCart() {
  var el = document.getElementById('cartBody');
  el.innerHTML = '';
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
    div.innerHTML = '<div><p class="name">'+item.name+'</p><p class="sub">'+item.sub+' · Qté: '+item.qty+'</p></div>'
      + '<div class="citem-r"><span class="citem-p">'+total+'€</span></div>';
    var btn = document.createElement('button');
    btn.className = 'crm';
    btn.textContent = '×';
    btn.addEventListener('click', (function(name){ return function(){ removeFromCart(name); }; })(item.name));
    div.querySelector('.citem-r').appendChild(btn);
    el.appendChild(div);
  });
}
function openCart() { renderCart(); updateCartUI(); document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('active'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('active'); }
function checkout() { if(!cart.length){showToast('Panier vide !');return;} showToast('Redirection paiement sécurisé...'); closeCart(); }
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
