// admin.js — Gestion des statuts produits depuis site.json

const STATUT_CONFIG = {
  'en_creation':        { label: 'En création',        color: '#8b5cf6', bg: 'rgba(139,92,246,.15)', icon: '🔧' },
  'en_production':      { label: 'En production',       color: '#f59e0b', bg: 'rgba(245,158,11,.15)', icon: '⚙️' },
  'bientot_disponible': { label: 'Bientôt disponible',  color: '#3b82f6', bg: 'rgba(59,130,246,.15)', icon: '⏳' },
  'disponible':         { label: 'Disponible',           color: '#4caf7d', bg: 'rgba(76,175,125,.15)', icon: '✅' },
  'rupture':            { label: 'Rupture de stock',     color: '#e05555', bg: 'rgba(224,85,85,.15)',  icon: '❌' },
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/site.json')
    .then(r => r.json())
    .then(data => {
      if (data.gammes) appliquerStatutsGammes(data.gammes);
      if (data.produits) appliquerStatutsProduits(data.produits);
    })
    .catch(() => console.warn('site.json non chargé.'));
});

function appliquerStatutsGammes(gammes) {
  Object.keys(gammes).forEach(key => {
    const statut = gammes[key].statut;
    if (!statut || statut === 'disponible') return;
    const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG['bientot_disponible'];
    document.querySelectorAll('[data-gamme="' + key + '"]').forEach(el => {
      if (el.querySelector('.badge-statut-gamme')) return;
      const badge = document.createElement('span');
      badge.className = 'badge-statut-gamme';
      badge.textContent = cfg.icon + ' ' + cfg.label;
      badge.style.cssText = 'position:absolute;top:.7rem;left:.7rem;z-index:10;background:' + cfg.color + ';color:#fff;border-radius:999px;padding:.2rem .6rem;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:inline-block;';
      el.style.position = 'relative';
      el.insertBefore(badge, el.firstChild);
    });
  });
}

function appliquerStatutsProduits(produits) {
  Object.keys(produits).forEach(pid => {
    const statut = produits[pid].statut;
    if (!statut || statut === 'disponible') return;
    const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG['bientot_disponible'];
    document.querySelectorAll('[data-pid="' + pid + '"]').forEach(el => {
      if (el.querySelector('.badge-statut-produit')) return;
      const badge = document.createElement('span');
      badge.className = 'badge-statut-produit';
      badge.textContent = cfg.icon + ' ' + cfg.label;
      badge.style.cssText = 'display:inline-block;background:' + cfg.color + ';color:#fff;border-radius:999px;padding:.18rem .55rem;font-size:.6rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.4rem;';
      el.insertBefore(badge, el.firstChild);
    });
  });
}
