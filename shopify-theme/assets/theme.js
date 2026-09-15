/* Progressive enhancement only: native forms and navigation work without JS. */
(() => {
  const updateHeader = () => document.querySelectorAll('.site-header.is-transparent').forEach(el => el.classList.toggle('is-scrolled', window.scrollY > 60));
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();
  document.addEventListener('shopify:section:load', updateHeader);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = event.target.closest('details[open]');
    if (open) { open.open = false; open.querySelector('summary').focus(); }
  });
  class ProductRecommendations extends HTMLElement {
    connectedCallback() {
      if (this.dataset.loaded) return;
      this.dataset.loaded = 'true';
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        fetch(this.dataset.url).then(response => { if (!response.ok) throw new Error('Recommendations unavailable'); return response.text(); })
          .then(html => { const content = new DOMParser().parseFromString(html, 'text/html').querySelector('product-recommendations'); if (content?.querySelector('.product-card')) this.innerHTML = content.innerHTML; })
          .catch(() => {});
      }, {rootMargin:'200px'});
      observer.observe(this);
    }
  }
  if (!customElements.get('product-recommendations')) customElements.define('product-recommendations', ProductRecommendations);
})();
