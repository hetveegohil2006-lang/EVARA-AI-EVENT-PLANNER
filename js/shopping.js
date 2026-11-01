/**
 * EVARA Private Concierge — Shopping Assistant Controller
 * Curated supply catalog, quantity counters, Firestore procurement synchronization, and price summaries.
 */

const ShoppingController = {
  renderCatalog(filter = 'all') {
    const listContainer = document.getElementById('shoppingItemsList') || document.getElementById('shoppingRosterList');
    if (!listContainer) {
      this.recalculateTotal();
      return;
    }

    let items = Storage.get(STORAGE_KEYS.SHOPPING, DEFAULT_SHOPPING);

    if (filter === 'pending') {
      items = items.filter(i => !i.purchased);
    } else if (filter !== 'all') {
      items = items.filter(i => (i.category || '').toLowerCase().includes(filter.toLowerCase()));
    }

    listContainer.innerHTML = items.map(item => `
      <div class="card flex items-center justify-between gap-md mb-sm ${item.purchased ? 'bg-surface-low' : ''}" style="background: white; border: 1px solid var(--color-champagne); padding: 1rem 1.25rem;">
        <div class="flex items-center gap-md">
          <label class="checkbox-custom">
            <input type="checkbox" ${item.purchased ? 'checked' : ''} onchange="ShoppingController.togglePurchased('${item.id}')" style="accent-color: var(--color-terracotta); width: 18px; height: 18px;"/>
            <span class="checkbox-box"></span>
          </label>
          <div>
            <div class="font-title-md ${item.purchased ? 'text-outline' : 'text-on-surface'}" style="${item.purchased ? 'text-decoration: line-through; opacity: 0.6;' : 'font-weight: 700; color: var(--color-espresso);'}">
              ${item.name}
            </div>
            <div class="flex items-center gap-xs font-body-sm text-outline mt-2xs text-xs text-muted">
              <span class="badge badge-champagne" style="font-size: 10px;">${item.category}</span>
              <span>• Sourced via ${item.merchant || 'Artisan Direct'}</span>
              <span>• Qty: ${item.qty}</span>
              ${item.assignedTo ? `<span>• Assigned: ${item.assignedTo}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-md">
          <div class="text-right">
            <div class="font-headline-sm text-primary font-semibold" style="font-size: 16px; font-weight: 700; color: var(--color-espresso);">
              ${App?.formatINR ? App.formatINR(item.price * item.qty) : '₹' + (item.price * item.qty)}
            </div>
            <div class="font-label-sm text-outline text-muted text-xs">
              ${App?.formatINR ? App.formatINR(item.price) : '₹' + item.price} each
            </div>
          </div>
          <button class="icon-btn" onclick="ShoppingController.deleteItem('${item.id}')" title="Remove item">
            <span class="material-symbols-outlined" style="font-size: 18px; color: var(--error);">delete</span>
          </button>
        </div>
      </div>
    `).join('');

    this.recalculateTotal();
  },

  async togglePurchased(id) {
    const items = Storage.get(STORAGE_KEYS.SHOPPING, DEFAULT_SHOPPING);
    const item = items.find(i => i.id === id);
    if (item) {
      const nextState = !item.purchased;
      await Storage.toggleShoppingItem(id, nextState);
      this.renderCatalog();
      App?.toast?.(`${item.name} marked as ${nextState ? 'Procured' : 'Pending'}`, 'shopping_bag');
    }
  },

  async addItem(itemData) {
    await Storage.addShoppingItem(itemData);
    this.renderCatalog();
    App?.toast?.(`Added "${itemData.name}" to shopping roster`, 'check_circle');
  },

  async deleteItem(id) {
    if (!confirm('Remove this item from procurement checklist?')) return;
    await Storage.deleteShoppingItem(id);
    this.renderCatalog();
    App?.toast?.('Item removed from shopping checklist', 'delete');
  },

  recalculateTotal() {
    const items = Storage.get(STORAGE_KEYS.SHOPPING, DEFAULT_SHOPPING);
    const totalProcured = items.filter(i => i.purchased).reduce((acc, i) => acc + (Number(i.price) * Number(i.qty)), 0);
    const totalEstimated = items.reduce((acc, i) => acc + (Number(i.price) * Number(i.qty)), 0);

    const totalEl = document.getElementById('shoppingTotalDisplay');
    if (totalEl && App?.formatINR) totalEl.textContent = App.formatINR(totalEstimated);

    const procuredEl = document.getElementById('shoppingProcuredDisplay');
    if (procuredEl && App?.formatINR) procuredEl.textContent = App.formatINR(totalProcured);
  }
};

window.ShoppingController = ShoppingController;

// Subscribe for real-time updates
Storage.subscribe(STORAGE_KEYS.SHOPPING, () => {
  ShoppingController.renderCatalog();
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shoppingItemsList') || document.getElementById('shoppingRosterList')) {
    ShoppingController.renderCatalog();
  }

  // Connect bespoke modal form submit
  const bespokeForm = document.getElementById('bespokeItemForm') || document.querySelector('#bespokeItemModal form');
  if (bespokeForm) {
    bespokeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('newBespokeTitle')?.value?.trim();
      const cat = document.getElementById('newBespokeCat')?.value || 'Decor';
      const cost = parseInt(document.getElementById('newBespokeCost')?.value || '0', 10);
      const assignee = document.getElementById('newBespokeAssignee')?.value?.trim() || 'Eleanor Vance';

      if (!title) return;

      await ShoppingController.addItem({
        name: title,
        category: cat,
        price: cost,
        qty: 1,
        purchased: false,
        assignedTo: assignee,
        merchant: "Artisan Direct"
      });

      const modal = document.getElementById('bespokeItemModal');
      if (modal) modal.style.display = 'none';
      bespokeForm.reset();
    });
  }
});
