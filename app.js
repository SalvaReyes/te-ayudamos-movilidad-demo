const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
  menu?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.classList.toggle('is-open', open);
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
const catalogue = document.querySelector('.product-grid');
if (catalogue) {
  // Sólo se carga al existir el catálogo. El contenido útil ya está en el HTML.
  fetch('/te-ayudamos-movilidad-demo/tarifas.json').then(response => {
    if (!response.ok) throw new Error('No se pudieron cargar las duraciones.');
    return response.json();
  }).then(products => {
    const euros = new Intl.NumberFormat('es-ES', {style:'currency',currency:'EUR'});
    function updatePrices() {
      const days = Number(document.querySelector('[name="period"]:checked').value);
      for (const product of products) {
        const effectiveDays = Math.max(days, product.minimumDays);
        const price = product.prices[product.periods.indexOf(effectiveDays)];
        document.querySelector(`[data-price="${product.slug}"]`).textContent = euros.format(price);
        document.querySelector(`[data-period-label="${product.slug}"]`).textContent = ` / ${effectiveDays} días`;
        const advance = document.querySelector(`[data-advance="${product.slug}"]`);
        advance.textContent = `Anticipo: ${euros.format(product.advancePrice)} por ${product.billingPeriodDays} días.`;
        advance.hidden = effectiveDays === product.billingPeriodDays;
      }
      document.getElementById('price-status').textContent = `Tarifas según un uso de ${days} días, respetando el mínimo de cada equipo. Todos los alquileres se pagan por adelantado en periodos de 28 días. Cuota anual, fianza y transporte aparte.`;
    }
    document.querySelectorAll('[name="period"]').forEach(input => input.addEventListener('change', updatePrices));
    updatePrices();
  }).catch(() => {
    document.querySelector('[name="period"][value="28"]').checked = true;
    document.querySelector('.period-picker').disabled = true;
    document.getElementById('price-status').textContent = 'Se muestran los anticipos de 28 días. Consulta las duraciones admitidas y los mínimos en cada ficha de producto.';
  });
}
