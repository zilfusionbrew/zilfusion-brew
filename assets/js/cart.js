/*
  Zil Fusion Brew — Panier (localStorage)
  - Ajout depuis les boutons .add-to-cart (data-id, data-name, data-price)
  - Affichage dans panier.html
  - Pré-remplissage du formulaire contact (commande)
*/

(function(){
  const STORAGE_KEY = 'zilfusion_cart_v1';

  function safeParse(json, fallback){
    try { return JSON.parse(json) ?? fallback; } catch(e){ return fallback; }
  }

  function getCart(){
    const cart = safeParse(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(cart) ? cart : [];
  }

  function saveCart(cart){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function formatEUR(n){
    const value = Number(n) || 0;
    return value.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
  }

  function cartCount(cart){
    return cart.reduce((acc, it)=> acc + (Number(it.qty)||0), 0);
  }

  function cartTotal(cart){
    return cart.reduce((acc, it)=> acc + (Number(it.price)||0) * (Number(it.qty)||0), 0);
  }

  function addToCart(item){
    const cart = getCart();
    const id = String(item.id || '').trim();
    if(!id) return;

    const existing = cart.find(it => it.id === id);
    if(existing){
      existing.qty = (Number(existing.qty)||0) + (Number(item.qty)||1);
    } else {
      cart.push({
        id,
        name: String(item.name || 'Produit'),
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1
      });
    }
    saveCart(cart);
  }

  function removeFromCart(id){
    const cart = getCart().filter(it => it.id !== id);
    saveCart(cart);
    renderCartPage();
  }

  function setQty(id, qty){
    const cart = getCart();
    const it = cart.find(x => x.id === id);
    if(!it) return;
    const q = Math.max(1, Math.min(99, Number(qty)||1));
    it.qty = q;
    saveCart(cart);
    renderCartPage();
  }

  function clearCart(){
    saveCart([]);
    renderCartPage();
  }

  function updateCartBadge(){
    const cart = getCart();
    const n = cartCount(cart);

    // Met à jour tous les boutons/liens vers panier
    const links = Array.from(document.querySelectorAll('a.btn'))
      .filter(a => {
        const href = (a.getAttribute('href') || '').trim();
        return href === 'panier.html' || href === '/panier.html' || href.endsWith('/panier.html');
      });
    links.forEach(a => {
      a.textContent = n > 0 ? `Panier (${n})` : 'Panier';
    });
  }

  function bindAddButtons(){
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        addToCart({ id, name, price, qty: 1 });

        // Petit feedback discret
        const prev = btn.textContent;
        btn.textContent = 'Ajouté ✓';
        btn.disabled = true;
        setTimeout(()=>{ btn.textContent = prev; btn.disabled = false; }, 900);
      });
    });
  }

  function buildOrderMessage(cart){
    if(!cart.length) return '';
    const lines = [];
    lines.push('Bonjour,');
    lines.push('Je souhaite commander :');
    lines.push('');
    cart.forEach(it => {
      lines.push(`- ${it.name} x${it.qty} — ${formatEUR((Number(it.price)||0) * (Number(it.qty)||0))}`);
    });
    lines.push('');
    lines.push(`Total estimé : ${formatEUR(cartTotal(cart))}`);
    lines.push('');
    lines.push('Merci !');
    return lines.join('\n');
  }

  function renderCartPage(){
    const root = document.getElementById('cartRoot');
    if(!root) return;

    const cart = getCart();
    if(cart.length === 0){
      root.innerHTML = `
        <div class="card pad">
          <p class="small">Ton panier est vide.</p>
          <div style="margin-top:1.0rem; display:flex; gap:.7rem; flex-wrap:wrap">
            <a class="btn" href="boutique.html">Aller à la boutique</a>
            <a class="btn secondary" href="contact.html">Besoin d’aide</a>
          </div>
        </div>
      `;
      return;
    }

    const rows = cart.map(it => {
      const lineTotal = (Number(it.price)||0) * (Number(it.qty)||0);
      return `
        <div class="card pad" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin:.7rem 0">
          <div style="min-width:0">
            <div style="font-weight:850; line-height:1.2">${escapeHtml(it.name)}</div>
            <div class="small" style="opacity:.85; margin-top:.25rem">${formatEUR(it.price)} / unité</div>
          </div>
          <div style="display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; justify-content:flex-end">
            <label class="small" style="display:flex; align-items:center; gap:.4rem">
              Qté
              <input class="input" type="number" min="1" max="99" value="${Number(it.qty)||1}" data-qty="${escapeAttr(it.id)}" style="width:84px; padding:.55rem .65rem"/>
            </label>
            <div style="font-weight:900; min-width:140px; text-align:right">${formatEUR(lineTotal)}</div>
            <button class="btn secondary" type="button" data-remove="${escapeAttr(it.id)}">Retirer</button>
          </div>
        </div>
      `;
    }).join('');

    const total = formatEUR(cartTotal(cart));
    const msg = encodeURIComponent(buildOrderMessage(cart));
    const contactLink = `commande.html?subject=${encodeURIComponent('Commande via panier')}&message=${msg}`;

    root.innerHTML = `
      ${rows}
      <div class="card pad" style="margin-top:1rem">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap">
          <div>
            <div class="kicker">Total</div>
            <div style="font-size:1.6rem; font-weight:950">${total}</div>
            <div class="small" style="opacity:.85; margin-top:.25rem">Paiement non activé (vitrine). Envoi de la demande via le formulaire.</div>
          </div>
          <div style="display:flex; gap:.7rem; flex-wrap:wrap; justify-content:flex-end">
            <button class="btn secondary" type="button" id="clearCart">Vider le panier</button>
            <a class="btn" href="${contactLink}">Finaliser la commande →</a>
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', ()=> removeFromCart(btn.getAttribute('data-remove')));
    });
    root.querySelectorAll('input[data-qty]').forEach(input => {
      input.addEventListener('change', ()=> setQty(input.getAttribute('data-qty'), input.value));
    });
    const clearBtn = document.getElementById('clearCart');
    if(clearBtn) clearBtn.addEventListener('click', clearCart);
  }

  function escapeHtml(str){
    return String(str||'').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
  function escapeAttr(str){
    return escapeHtml(str).replace(/\s/g,'');
  }

  function prefillContactFromQuery(){
    const form = document.querySelector('form[name="contact"]');
    if(!form) return;

    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    const message = params.get('message');

    const subjectInput = form.querySelector('input[name="subject"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if(subject && subjectInput && !subjectInput.value){
      subjectInput.value = subject;
    }
    if(message && messageInput && !messageInput.value){
      messageInput.value = message;
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateCartBadge();
    bindAddButtons();
    renderCartPage();
    prefillContactFromQuery();
  });

})();
