/* global App */
/**
 * EVARA Private Concierge — Organizer & Volunteer Team Chat
 * Multi-channel dispatch, live message threads, and team collaboration.
 */

const ChatController = {
  activeChannel: 'announcements',

  messages: {
    'announcements': [
      { sender: 'Eleanor Vance', role: 'Principal Host', time: '14:20', text: 'Good afternoon team. Chef Fabrizio has cleared all dietary menus with the villa kitchen staff.' },
      { sender: 'Aria Concierge', role: 'Lead AI Concierge', time: '14:22', text: 'Automatic telemetry check: 34 of 40 attendee profiles confirmed. Two Mercedes V-Class shuttles verified for Florence Peretola arrivals.' }
    ],
    'catering-logistics': [
      { sender: 'Marco Rossi', role: 'Catering Lead', time: '11:15', text: 'Sommelier pairing confirmed: 2019 Brunello di Montalcino vintage secured for Day 2 sunset toast.' },
      { sender: 'Eleanor Vance', role: 'Principal Host', time: '11:30', text: 'Superb. Make sure vegetarian tasting portions are plated in the east pergola.' }
    ],
    'vip-transfers': [
      { sender: 'Luigi V.', role: 'Fleet Chauffeur', time: '09:40', text: 'First Sprinter departure is scheduled for 15:30 CET from Florence Hub.' }
    ]
  },

  switchChannel(channelKey, el) {
    this.activeChannel = channelKey;
    document.querySelectorAll('.channel-item').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');

    const titleEl = document.getElementById('chatChannelTitle');
    if (titleEl) titleEl.textContent = '#' + channelKey;

    this.renderMessages();
  },

  renderMessages() {
    const stream = document.getElementById('chatMessagesStream');
    if (!stream) return;

    const list = this.messages[this.activeChannel] || [];
    stream.innerHTML = list.map(m => `
      <div class="flex items-start gap-sm mb-md animate-fade-in">
        <div class="user-avatar" style="width: 38px; height: 38px; font-size: 11px; flex-shrink: 0; background-color: ${m.role.includes('AI') ? 'var(--secondary)' : 'var(--primary)'};">
          ${m.sender.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div style="flex: 1;">
          <div class="flex items-center gap-xs mb-2xs">
            <span class="font-title-md" style="font-size: 14px;">${m.sender}</span>
            <span class="badge ${m.role.includes('AI') ? 'badge-gold' : 'badge-primary'}" style="font-size: 9px; padding: 2px 6px;">${m.role}</span>
            <span class="font-label-sm text-outline" style="font-size: 11px;">${m.time}</span>
          </div>
          <div class="card" style="padding: 0.85rem 1rem; border-radius: var(--radius-xl); background: var(--surface-container-lowest);">
            <p class="font-body-md text-on-surface" style="margin: 0; line-height: 1.5;">${m.text}</p>
          </div>
        </div>
      </div>
    `).join('');

    stream.scrollTop = stream.scrollHeight;
  },

  sendMessage() {
    const input = document.getElementById('chatMessageInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const newMsg = {
      sender: 'Eleanor Vance',
      role: 'Principal Host',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    if (!this.messages[this.activeChannel]) {
      this.messages[this.activeChannel] = [];
    }
    this.messages[this.activeChannel].push(newMsg);
    this.renderMessages();
  }
};

window.ChatController = ChatController;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatMessagesStream')) {
    ChatController.renderMessages();
  }
});
