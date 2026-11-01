/**
 * EVARA Private Concierge — Payments & QR Gateway Controller
 * Manages UPI dynamic QR modal, UTR reconciliation, and escrow settlement in Firestore.
 */

const PaymentsController = {
  openQrModal(amount = 41666, payee = 'EVARA Escrow Nodal Account') {
    const amountInput = document.getElementById('qrAmountInput');
    const payeeDisplay = document.getElementById('qrPayeeDisplay');
    const upiLinkInput = document.getElementById('qrUpiStringInput');

    if (amountInput) amountInput.value = amount;
    if (payeeDisplay) payeeDisplay.textContent = payee;
    if (upiLinkInput) upiLinkInput.value = `upi://pay?pa=evara.escrow@icici&pn=EVARA+Escrow&am=${amount}&cu=INR`;

    const modal = document.getElementById('paymentQrModal') || document.getElementById('qrModal');
    if (modal) modal.style.display = 'flex';
    App?.toast?.(`Generated dynamic payment QR for ${App?.formatINR ? App.formatINR(amount) : '₹' + amount}`, 'qr_code_2');
  },

  copyUpiLink() {
    const input = document.getElementById('qrUpiStringInput');
    if (input) {
      input.select();
      navigator.clipboard?.writeText(input.value);
      App?.toast?.('UPI link copied to clipboard', 'content_copy');
    }
  },

  async markSettled(guestId) {
    const guests = Storage.get(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      await Storage.updateGuest(guestId, { paymentStatus: 'Settled' });
      App?.toast?.(`Marked ${guest.name}'s contribution as Settled in Vault`, 'check_circle');
      if (typeof GuestsController !== 'undefined') {
        GuestsController.renderTable();
      }
    }
  }
};

window.PaymentsController = PaymentsController;
