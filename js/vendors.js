/**
 * EVARA Private Concierge — Vendor Discovery & Curation
 * Artisan directory, category filters, shortlist tray, and multi-vendor RFP drafting with Firestore.
 */

const VendorsController = {
  get shortlist() {
    return Storage.get(STORAGE_KEYS.VENDOR_SELECTIONS, new Set(['vnd-1', 'vnd-2']));
  },

  renderDirectory(category = 'all', searchQuery = '') {
    const grid = document.getElementById('vendorsGrid');
    if (!grid) {
      this.updateBadge();
      return;
    }

    let vendors = Storage.get(STORAGE_KEYS.VENDORS, DEFAULT_VENDORS);

    if (category !== 'all') {
      vendors = vendors.filter(v => (v.category || '').toLowerCase().includes(category.toLowerCase()));
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      vendors = vendors.filter(v => 
        (v.name || '').toLowerCase().includes(q) || 
        (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    grid.innerHTML = vendors.map(vendor => {
      const isSaved = this.shortlist.has(vendor.id);
      return `
        <div class="vendor-card">
          <div class="vendor-image-wrap">
            <img src="${vendor.image}" alt="${vendor.name}" loading="lazy"/>
            <div class="vendor-badge-top text-primary font-bold">${vendor.priceTier}</div>
          </div>
          <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
            <div>
              <div class="flex items-center justify-between mb-xs">
                <span class="badge badge-gold" style="font-size: 10px;">${vendor.category}</span>
                <div class="flex items-center gap-2xs font-label-md text-tertiary">
                  <span class="material-symbols-outlined fill" style="font-size: 15px;">star</span>
                  <span>${vendor.rating}</span>
                  <span class="text-outline">(${vendor.reviews})</span>
                </div>
              </div>
              <h3 class="font-headline-sm" style="font-size: 18px; margin-bottom: 4px;">${vendor.name}</h3>
              <p class="font-body-sm text-outline flex items-center gap-xs">
                <span class="material-symbols-outlined text-secondary" style="font-size: 16px;">location_on</span>
                <span>${vendor.location}</span>
              </p>
              <div class="flex flex-wrap gap-2xs mt-sm mb-md">
                ${vendor.tags.map(t => `<span class="badge" style="background: var(--surface-container); font-size: 10px;">${t}</span>`).join('')}
              </div>
            </div>
            <div class="flex items-center justify-between pt-sm border-t" style="border-top: 1px solid var(--surface-container-high);">
              <span class="badge ${vendor.status.includes('Booked') ? 'badge-success' : 'badge-warning'}">
                ${vendor.status}
              </span>
              <button class="btn btn-sm ${isSaved ? 'btn-primary' : 'btn-secondary'}" onclick="VendorsController.toggleShortlist('${vendor.id}', '${vendor.name}')">
                <span class="material-symbols-outlined fill" style="font-size: 16px;">${isSaved ? 'favorite' : 'favorite_border'}</span>
                <span>${isSaved ? 'Shortlisted' : 'Shortlist'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.updateBadge();
  },

  async toggleShortlist(id, name = 'Artisan') {
    const isSaved = this.shortlist.has(id);
    const nextSaved = !isSaved;

    await Storage.toggleVendorShortlist(id, nextSaved);

    if (nextSaved) {
      App?.toast?.(`${name} added to curated shortlist`, 'favorite');
    } else {
      App?.toast?.(`${name} removed from shortlist`, 'favorite_border');
    }

    this.renderDirectory();
    this.updateBadge();
  },

  updateBadge() {
    const count = this.shortlist.size;
    const badge = document.getElementById('shortlistBadge');
    if (badge) badge.textContent = count;
    const headerBadge = document.getElementById('headerShortlistBadge');
    if (headerBadge) headerBadge.textContent = count;
    const shortlistCount = document.getElementById('shortlistCount');
    if (shortlistCount) shortlistCount.textContent = count;
  },

  triggerRFP(vendorName) {
    const vendorEl = document.getElementById('rfpTargetVendor');
    if (vendorEl && vendorName) vendorEl.textContent = `Quote Request: ${vendorName}`;
    const modal = document.getElementById('rfpModal');
    if (modal) modal.style.display = 'flex';
  },

  async submitRFP(event) {
    if (event) event.preventDefault();
    const vendorName = document.getElementById('rfpTargetVendor')?.textContent?.replace('Quote Request:', '').trim() || 'Curated Artisan';
    const notes = document.querySelector('#rfpModal textarea')?.value || '';

    await Storage.saveVendorRfp(vendorName, { notes });

    const modal = document.getElementById('rfpModal');
    if (modal) modal.style.display = 'none';

    App?.toast?.(`Multi-Vendor RFP dispatched to ${vendorName}`, 'send');
  }
};

window.VendorsController = VendorsController;

// Connect inline form submit
document.addEventListener('DOMContentLoaded', () => {
  const rfpForm = document.querySelector('#rfpModal form');
  if (rfpForm) {
    rfpForm.addEventListener('submit', (e) => {
      VendorsController.submitRFP(e);
    });
  }

  if (document.getElementById('vendorsGrid')) {
    VendorsController.renderDirectory();
  } else {
    VendorsController.updateBadge();
  }
});
