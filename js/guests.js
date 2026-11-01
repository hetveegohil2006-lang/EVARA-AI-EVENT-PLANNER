/**
 * EVARA Private Concierge — Guest Management Controller
 * Renders attendee rosters, manages Firestore CRUD operations, RSVP updates,
 * table/suite allocations, and synchronized contributions.
 */

const GuestsController = {
  renderTable(filterStatus = 'all', searchQuery = '') {
    const tableBody = document.getElementById('guestsTableBody') || document.getElementById('guests-tbody');
    if (!tableBody) return;

    let guests = Storage.get(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);

    if (filterStatus !== 'all') {
      guests = guests.filter(g => (g.rsvp || '').toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      guests = guests.filter(g => 
        (g.name || '').toLowerCase().includes(q) || 
        (g.email || '').toLowerCase().includes(q) ||
        (g.suite || g.table || '').toLowerCase().includes(q)
      );
    }

    const isContributionsPage = Boolean(document.getElementById('guests-tbody'));

    if (isContributionsPage) {
      // Step 3: Guests & Split Page table layout
      tableBody.innerHTML = guests.map(guest => {
        const initials = (guest.name || 'G').split(' ').map(n => n[0]).slice(0, 2).join('');
        const isConfirmed = (guest.rsvp || '').toLowerCase() === 'confirmed';
        return `
          <tr>
            <td>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#E9D8C8] text-[#80604f] flex items-center justify-center font-bold text-xs shadow-xs">
                  ${initials}
                </div>
                <div>
                  <div class="font-title-sm text-primary font-bold">${guest.name}</div>
                  <div class="font-body-sm text-outline text-[12px]">${guest.email || guest.phone || 'VIP Contact'}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge ${isConfirmed ? 'badge-primary' : 'badge-champagne'} text-[11px]">
                ${guest.role || (isConfirmed ? 'VIP Confirmed' : 'Invited Patron')}
              </span>
            </td>
            <td>
              <span class="font-body-md text-on-surface font-semibold text-[13px]">${guest.suite || guest.table || 'Villa Suite 1'}</span>
            </td>
            <td>
              <span class="badge badge-champagne text-[11px]">${guest.dietary || 'Standard Menu'}</span>
            </td>
            <td>
              <span class="badge ${isConfirmed ? 'badge-primary' : 'badge-champagne'} text-[11px]">
                ${guest.rsvp || 'Pending'}
              </span>
            </td>
            <td>
              <span class="font-label-md text-on-surface font-semibold">${guest.pax || 1} Pax</span>
            </td>
            <td style="text-align: right;">
              <div class="flex items-center justify-end gap-1">
                <button class="btn btn-ghost btn-sm p-1" onclick="GuestsController.toggleRsvp('${guest.id}')" title="Toggle RSVP">
                  <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                </button>
                <button class="btn btn-ghost btn-sm p-1 text-error" onclick="GuestsController.deleteGuest('${guest.id}')" title="Remove Guest">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      // Event-Scoped Guest Directory Page layout
      tableBody.innerHTML = guests.map(guest => {
        const initials = (guest.name || 'G').split(' ').map(n => n[0]).slice(0, 2).join('');
        const isConfirmed = (guest.rsvp || '').toLowerCase() === 'confirmed';
        const isSettled = (guest.paymentStatus || '').toLowerCase() === 'settled';
        const suite = guest.suite || guest.table || 'Villa Suite 1';
        const dietary = guest.dietary || 'Standard';
        const role = guest.role || 'Guest';

        return `
          <tr style="border-bottom: 1px solid var(--color-champagne-light); cursor: pointer;" onclick="if(typeof inspectGuest === 'function') inspectGuest('${guest.name}', '${role}', '${suite}', '${dietary}', '${guest.rsvp}', '${App?.formatINR ? App.formatINR(guest.contribution) : '₹' + guest.contribution}')">
            <td style="padding: 0.75rem 1rem;">
              <div class="flex items-center gap-xs">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style="background: var(--color-champagne); color: var(--color-mocha);">
                  ${initials}
                </div>
                <div>
                  <span class="font-bold text-sm block leading-tight">${guest.name}</span>
                  <span class="text-xs text-muted block" style="font-size: 11px;">${suite}</span>
                </div>
              </div>
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span class="badge ${isConfirmed ? 'badge-success' : 'badge-warning'}" style="font-size: 10px;">
                ${guest.rsvp}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: center; font-weight: bold;">${guest.pax || 1}</td>
            <td style="padding: 0.75rem 1rem; font-weight: bold; color: var(--color-espresso);">
              ${App?.formatINR ? App.formatINR(guest.contribution) : '₹' + (guest.contribution || 41666)}
            </td>
            <td style="padding: 0.75rem 1rem;">
              <span class="badge ${isSettled ? 'badge-success' : 'badge-accent'}" style="font-size: 10px;">
                ${guest.paymentStatus || 'Pending'}
              </span>
            </td>
            <td style="padding: 0.75rem 1rem; text-align: right;">
              <div class="flex items-center justify-end gap-xs">
                <button class="icon-btn" onclick="event.stopPropagation(); GuestsController.toggleRsvp('${guest.id}')" title="Toggle RSVP">
                  <span class="material-symbols-outlined" style="font-size: 18px;">sync_alt</span>
                </button>
                <button class="icon-btn" onclick="event.stopPropagation(); GuestsController.deleteGuest('${guest.id}')" title="Remove Patron">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: var(--error);">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    this.updateStats();
  },

  updateStats() {
    const guests = Storage.get(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
    const confirmedCount = guests.filter(g => (g.rsvp || '').toLowerCase() === 'confirmed').reduce((acc, g) => acc + (g.pax || 1), 0);
    const totalCount = guests.reduce((acc, g) => acc + (g.pax || 1), 0);

    const confirmedEl = document.getElementById('confirmedGuestCount');
    if (confirmedEl) confirmedEl.textContent = `${confirmedCount} Pax`;

    const totalEl = document.getElementById('totalGuestCount');
    if (totalEl) totalEl.textContent = `${guests.length} Invitations`;
  },

  async toggleRsvp(guestId) {
    const guests = Storage.get(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      const nextRsvp = (guest.rsvp || '').toLowerCase() === 'confirmed' ? 'Pending' : 'Confirmed';
      await Storage.updateGuest(guestId, { rsvp: nextRsvp });
      this.renderTable();
      App?.toast?.(`RSVP for ${guest.name} updated to ${nextRsvp}`, 'sync');
    }
  },

  async addGuest(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('newGuestName')?.value?.trim() || document.getElementById('guestNameInput')?.value?.trim();
    const email = document.getElementById('newGuestContact')?.value?.trim() || document.getElementById('guestEmailInput')?.value?.trim() || '';
    const phone = document.getElementById('guestPhoneInput')?.value?.trim() || '';
    const suite = document.getElementById('newGuestSuite')?.value?.trim() || document.getElementById('guestTableInput')?.value?.trim() || 'Villa Suite 1';
    const dietary = document.getElementById('newGuestDietary')?.value?.trim() || document.getElementById('guestDietaryInput')?.value?.trim() || 'Standard';
    const pax = parseInt(document.getElementById('newGuestPax')?.value || '1', 10);
    const plusOnes = parseInt(document.getElementById('guestPlusOneInput')?.value || '0', 10);
    const rsvp = document.getElementById('guestRsvpInput')?.value || 'Confirmed';

    if (!name) {
      App?.toast?.('Please specify patron name to proceed', 'error');
      return;
    }

    const newGuest = {
      name,
      email,
      phone,
      pax: pax + plusOnes,
      plusOnes,
      table: suite,
      suite: suite,
      dietary,
      rsvp,
      contribution: 41666 * (pax + plusOnes),
      paymentStatus: 'Pending Escrow'
    };

    await Storage.saveGuest(newGuest);

    const modal = document.getElementById('addGuestModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('open');
    }

    this.renderTable();
    App?.toast?.(`Patron ${name} vaulted to attendee roster`, 'person_add');
  },

  // Alias for wizard integration
  async add(guest) {
    const paxCount = guest.pax || (1 + (parseInt(guest.plusOnes, 10) || 0));
    await Storage.saveGuest({
      ...guest,
      pax: paxCount,
      contribution: guest.contribution || (41666 * paxCount),
      paymentStatus: guest.paymentStatus || 'Pending Escrow'
    });
    this.renderTable();
  },

  async deleteGuest(guestId) {
    if (!confirm('Are you sure you wish to withdraw this guest invitation?')) return;
    await Storage.deleteGuest(guestId);
    this.renderTable();
    App?.toast?.('Guest invitation safely removed from roster', 'delete');
  },

  init() {
    this.renderTable();
  }
};

window.GuestsController = GuestsController;
window.Guests = GuestsController;

// Subscribe to storage changes to ensure real-time UI consistency
Storage.subscribe(STORAGE_KEYS.GUESTS, () => {
  GuestsController.renderTable();
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('guestsTableBody') || document.getElementById('guests-tbody')) {
    GuestsController.renderTable();
  }
});
