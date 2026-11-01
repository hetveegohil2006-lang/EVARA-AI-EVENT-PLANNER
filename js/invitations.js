/**
 * EVARA Private Concierge — Invitation Designer & Stationery Atelier
 * Live invitation preview, typography calibration, Firestore persistence, and VIP link generation.
 */

const InvitationController = {
  async init() {
    const invite = await Storage.getInvitation();
    if (invite) {
      this.populateFields(invite);
    }
    this.bindInputs();
  },

  populateFields(invite) {
    const titleInput = document.getElementById('inviteTitleInput');
    const bodyInput = document.getElementById('inviteBodyInput') || document.getElementById('inviteMessageInput');
    const dateInput = document.getElementById('inviteDateInput') || document.getElementById('inviteDatesInput');
    const venueInput = document.getElementById('inviteVenueInput');

    if (titleInput && invite.title) titleInput.value = invite.title;
    if (bodyInput && (invite.message || invite.body)) bodyInput.value = invite.message || invite.body;
    if (dateInput && invite.dates) dateInput.value = invite.dates;
    if (venueInput && invite.venue) venueInput.value = invite.venue;

    this.updatePreview();
  },

  updatePreview() {
    const title = document.getElementById('inviteTitleInput')?.value || 'The Solstice Tuscan Gala';
    const body = document.getElementById('inviteBodyInput')?.value || document.getElementById('inviteMessageInput')?.value || 'Under the golden cypress canopy of Villa San Valentino, we request the honor of your company.';
    const date = document.getElementById('inviteDateInput')?.value || document.getElementById('inviteDatesInput')?.value || 'October 24–27, 2025';
    const venue = document.getElementById('inviteVenueInput')?.value || 'Castello di San Valentino, Tuscany';

    const canvasTitle = document.getElementById('canvasTitle') || document.getElementById('previewTitle');
    const canvasBody = document.getElementById('canvasBody') || document.getElementById('previewMessage');
    const canvasDate = document.getElementById('canvasDate') || document.getElementById('previewDates');
    const canvasVenue = document.getElementById('canvasVenue') || document.getElementById('previewVenue');

    if (canvasTitle) canvasTitle.textContent = title;
    if (canvasBody) canvasBody.textContent = body;
    if (canvasDate) canvasDate.textContent = date;
    if (canvasVenue) canvasVenue.textContent = venue;

    // Debounced persist to Firestore
    this.debounceSave({
      title,
      message: body,
      dates: date,
      venue
    });
  },

  _saveTimeout: null,
  debounceSave(data) {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(async () => {
      await Storage.saveInvitation(null, data);
    }, 1000);
  },

  setTheme(themeName) {
    const card = document.getElementById('invitationCard') || document.getElementById('invitationCanvas');
    if (!card) return;

    if (themeName === 'champagne') {
      card.style.background = '#FBF6EE';
      card.style.color = 'var(--color-espresso)';
      App?.toast?.('Theme switched to Champagne Gold', 'palette');
    } else if (themeName === 'terracotta') {
      card.style.background = '#FFF8F6';
      card.style.color = 'var(--color-espresso)';
      App?.toast?.('Theme switched to Tuscan Terracotta', 'palette');
    } else if (themeName === 'editorial-dark') {
      card.style.background = 'var(--color-espresso)';
      card.style.color = '#FFF8F6';
      App?.toast?.('Theme switched to Editorial Midnight', 'palette');
    }

    Storage.saveInvitation(null, { theme: themeName });
  },

  bindInputs() {
    ['inviteTitleInput', 'inviteBodyInput', 'inviteMessageInput', 'inviteDateInput', 'inviteDatesInput', 'inviteVenueInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updatePreview());
      }
    });
  },

  copyShareLink() {
    const currEvent = Storage.getCurrentEvent();
    const link = `${window.location.origin}/pages/invitations.html?event=${currEvent.id}`;
    App?.copyToClipboard?.(link, 'Bespoke VIP Invitation link copied to clipboard!');
  }
};

window.InvitationController = InvitationController;
window.updateInvitePreview = () => InvitationController.updatePreview();
window.setTheme = (t) => InvitationController.setTheme(t);

document.addEventListener('DOMContentLoaded', () => {
  InvitationController.init();
});
