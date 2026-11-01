/* global App */
/**
 * EVARA Private Concierge — AI Event Assistant (Aria & Julian)
 * Persona switcher, audio telemetry, interactive speech-to-text simulation, and concierge responses.
 */

const AssistantController = {
  activePersona: 'aria',
  isListening: false,
  playbackSpeed: 1.0,
  isMuted: false,

  personas: {
    aria: {
      name: 'Aria Concierge',
      badge: 'Executive • Poetic',
      subtitle: 'Tuscan Villa Operations & Hospitality Protocol Specialist',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_lJKilqzQz2AM1V9uAcF80Cp6TcCb3bWi4k5Gg29FotPpcnGtvwVvqpbquqtPA2OgLq3_lf5CxnhFXu4O8Xzdp_u3nTZw_14Nzph80GFvOKtQ2UU-pdzc2IlqRGffC3kpKGoC6JvmTls1ahzzIY6tdS9UVoCw37m272Z8rGVICaMrxVpJEPfe8lBfrHdw-PpbvDcdzoOeeoNr7H3J2ITICYXPDCbRuHwHdR_cKmk',
      welcome: "Good evening Eleanor. All 34 primary attendees have submitted dietary profiles—Chef Fabrizio has confirmed 8 vegetarian and 4 gluten-free custom banquets for the courtyard dinner. Catering spend currently sits at ₹2,25,000 against your ₹3,75,000 ceiling, leaving ₹1,50,000 in liquid reserve."
    },
    julian: {
      name: 'Julian Production',
      badge: 'Logistics & Ops',
      subtitle: 'Technical Logistics, Staging & Supplier Escrow Director',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCblbJh5I878bB-SpKIAcY8gMe7Y6eDKxYbJLsCd9KulLzbHxlhTUyWD5y9ceH4RVYJjOwQwtyWCKA1CYDUwJB_eJeVVu7wvrhkUuvh1Pyxt159059DQaD3CoEXwd7iI0KGXa-OjhGk0K7YVTDOh5o9-gXmjcddhmp-tkv3nw1ee6SCxaERRbWfk-HgXJU9movKZDcCDa0ptrrt2gazDwN_0Sc6KueuTqtYp3fikBU',
      welcome: "Julian standing by. All sound curfew permits for Chianti Hills are validated up to 01:30 AM. Generator loads for the festoon pergola lighting are calibrated, and airport transit sprinters 1 & 2 are ready for inspection."
    }
  },

  switchPersona(personaKey) {
    this.activePersona = personaKey;
    const p = this.personas[personaKey];
    if (!p) return;

    const nameEl = document.getElementById('persona-name-display');
    const subEl = document.getElementById('persona-subtitle-display');
    const avatarEl = document.getElementById('persona-avatar-img');
    const ariaBtn = document.getElementById('persona-aria-btn');
    const julianBtn = document.getElementById('persona-julian-btn');

    if (nameEl) nameEl.textContent = p.name;
    if (subEl) subEl.textContent = p.subtitle;
    if (avatarEl) avatarEl.src = p.avatar;

    if (personaKey === 'aria') {
      ariaBtn?.classList.add('active');
      julianBtn?.classList.remove('active');
    } else {
      julianBtn?.classList.add('active');
      ariaBtn?.classList.remove('active');
    }

    App.toast(`Concierge AI persona switched to ${p.name}`, 'smart_toy');
  },

  toggleVoiceInput() {
    this.isListening = !this.isListening;
    const micBtn = document.getElementById('mic-action-btn');
    const preview = document.getElementById('stt-preview-container');

    if (this.isListening) {
      micBtn?.classList.add('mic-btn-active');
      if (preview) preview.classList.remove('hidden');
      App.toast('Concierge speech detection listening...', 'mic');
    } else {
      micBtn?.classList.remove('mic-btn-active');
      if (preview) preview.classList.add('hidden');
    }
  },

  togglePlaybackSpeed() {
    this.playbackSpeed = this.playbackSpeed === 1.0 ? 1.2 : 1.0;
    const btn = document.getElementById('voice-speed-btn');
    if (btn) btn.textContent = `${this.playbackSpeed.toFixed(1)}x`;
    App.toast(`Audio playback speed: ${this.playbackSpeed.toFixed(1)}x`, 'speed');
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    const icon = document.getElementById('mute-icon');
    if (icon) icon.textContent = this.isMuted ? 'volume_off' : 'volume_up';
    App.toast(this.isMuted ? 'Concierge audio muted' : 'Concierge audio unmuted', 'volume_up');
  },

  populatePrompt(btnEl) {
    const input = document.getElementById('chat-input');
    if (input && btnEl) {
      input.value = btnEl.textContent.trim();
      input.focus();
    }
  },

  sendUserMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    const history = document.getElementById('dialogueHistory');
    if (!history) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-start justify-end gap-sm self-end max-w-2xl mb-md animate-fade-in';
    userMsg.innerHTML = `
      <div class="card" style="background-color: var(--color-espresso); color: var(--color-ivory); border-top-right-radius: 4px; padding: 1rem 1.25rem;">
        <div class="flex items-center justify-between gap-md mb-2xs opacity-80" style="font-size: 11px;">
          <span class="font-label-sm uppercase">Eleanor Vance (Host)</span>
          <span>Just now</span>
        </div>
        <p class="font-body-md text-white" style="margin: 0; line-height: 1.5;">${query}</p>
      </div>
      <div class="user-avatar" style="width: 36px; height: 36px; font-size: 11px; background-color: var(--primary);">
        EV
      </div>
    `;
    history.appendChild(userMsg);

    // Simulate AI response after short delay
    setTimeout(() => {
      const p = this.personas[this.activePersona];
      const aiMsg = document.createElement('div');
      aiMsg.className = 'flex items-start gap-sm self-start max-w-3xl mb-md animate-fade-in';
      aiMsg.innerHTML = `
        <div class="user-avatar" style="width: 36px; height: 36px; background-color: var(--secondary); flex-shrink: 0;">
          <span class="material-symbols-outlined" style="font-size: 18px; color: white;">auto_awesome</span>
        </div>
        <div class="card" style="padding: 1rem 1.25rem; border-top-left-radius: 4px; border: 1px solid var(--color-champagne); background: var(--surface-container-lowest);">
          <div class="flex items-center justify-between mb-2xs">
            <span class="font-title-md" style="font-size: 14px;">${p.name}</span>
            <span class="font-label-sm text-outline" style="font-size: 11px;">Just now</span>
          </div>
          <p class="font-body-md text-on-surface" style="margin: 0; line-height: 1.6;">
            I have cross-referenced your inquiry with our real-time Villa San Valentino estate dossier. Everything is calibrated according to protocol, and your remaining liquid headroom of ₹4,55,000 remains secure in escrow.
          </p>
        </div>
      `;
      history.appendChild(aiMsg);
      history.scrollTop = history.scrollHeight;
    }, 600);
  }
};

window.AssistantController = AssistantController;
