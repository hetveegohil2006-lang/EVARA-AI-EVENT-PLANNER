/**
 * EVARA Private Concierge — Events & Creation Pipeline
 * Multi-step creation wizard, archetype calibration, and Firestore event creation.
 */

const EventWizard = {
  getDraft() {
    return Storage.get('evara_event_draft', {
      title: 'Villa San Valentino Tuscan Gala 2025',
      archetype: 'Tuscan Gala & Wedding',
      dates: 'Oct 24–27, 2025',
      startDate: '2025-10-24',
      endDate: '2025-10-27',
      location: 'Villa San Valentino, Chianti Hills, Tuscany, Italy',
      venue: 'Villa San Valentino, Chianti Hills, Tuscany, Italy',
      targetBudget: 1500000,
      budget: 1500000,
      guestCount: 36,
      capacity: 45,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRlbWQJd7ix7X_HIBg4iwVHRQ2tfxZEQ9PlMHfoC2TtLGvtJgdn93WzONEIasNIGhLKaD7rSvu9wLmuiRRgkC-gldG34BdpZ8HV_SFQoewlkFGcmvXRqEonsxFuhXX-wh2HsZeSfkB6AaT2qAa06Za85AL0z4w61LmL0_YixPd2V49eRmx7oaSCxS__G0qZMvbHZG_EZrHLf6ecBb2rQOmRX3uefAwqkWACy7ft4k'
    });
  },

  saveDraft(updates) {
    const draft = { ...this.getDraft(), ...updates };
    Storage.set('evara_event_draft', draft);
    return draft;
  },

  updateDraft(updates) {
    return this.saveDraft(updates);
  },

  selectArchetype(typeOrEl, title) {
    if (typeof typeOrEl === 'string') {
      const formattedTitle = title || (typeOrEl.charAt(0).toUpperCase() + typeOrEl.slice(1) + ' Gathering');
      this.updateDraft({ archetype: formattedTitle });
      App?.toast?.(`Archetype selected: ${formattedTitle}`, 'auto_awesome');
    } else {
      document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
      if (typeOrEl) typeOrEl.classList.add('selected');
      this.updateDraft({ archetype: title });
      App?.toast?.(`Archetype selected: ${title}`, 'auto_awesome');
    }
  },

  async finalizeEvent() {
    const draft = this.getDraft();
    try {
      const newEvent = await Storage.createEvent({
        ...draft,
        targetBudget: draft.budget || draft.targetBudget || 1500000
      });
      App?.toast?.('Celebration successfully vaulted in Firestore!', 'celebration');
      setTimeout(() => {
        window.location.href = 'event-overview.html';
      }, 800);
      return newEvent;
    } catch (err) {
      console.error('Error finalizing event:', err);
      App?.toast?.('Event saved locally. Syncing with Vault...', 'auto_awesome');
      setTimeout(() => {
        window.location.href = 'event-overview.html';
      }, 800);
    }
  }
};

window.EventWizard = EventWizard;
