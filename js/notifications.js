/**
 * EVARA Private Concierge — Notifications Hub Controller
 * Live feeds, category segmentation, mark as read, and real-time Firestore sync.
 */

const NotificationsController = {
  renderFeed(category = 'all') {
    const list = document.getElementById('notificationsList');
    if (!list) {
      this.updateCounters();
      return;
    }

    let items = Storage.get(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);

    if (category !== 'all') {
      items = items.filter(n => (n.category || '').toLowerCase() === category.toLowerCase());
    }

    if (!items.length) {
      list.innerHTML = `
        <div class="card p-xl text-center" style="background: white; border: 1px solid var(--color-champagne);">
          <span class="material-symbols-outlined text-muted" style="font-size: 36px; margin-bottom: 0.5rem;">notifications_off</span>
          <h3 class="font-bold text-base" style="margin: 0 0 4px;">No Dispatches in this Feed</h3>
          <p class="text-xs text-muted" style="margin: 0;">All concierge activities and escrow logs are up to date.</p>
        </div>
      `;
      this.updateCounters();
      return;
    }

    list.innerHTML = items.map(n => `
      <div class="card p-md shadow-sm flex items-start justify-between gap-md ${n.unread ? 'unread-card' : ''}" style="background: ${n.unread ? '#FFFBF8' : 'white'}; border: 1px solid ${n.unread ? 'var(--color-terracotta)' : 'var(--color-champagne)'}; border-radius: var(--radius-lg);">
        <div class="flex items-start gap-md">
          <div class="notification-icon-box" style="width: 38px; height: 38px; border-radius: var(--radius-md); background: var(--color-champagne-light); display: flex; align-items: center; justify-content: center; color: var(--color-espresso); flex-shrink: 0;">
            <span class="material-symbols-outlined" style="font-size: 20px;">
              ${n.category === 'rsvp' ? 'how_to_reg' : (n.category === 'payments' ? 'account_balance_wallet' : (n.category === 'contracts' ? 'history_edu' : 'notifications_active'))}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-xs mb-2xs">
              <span class="badge badge-champagne" style="font-size: 10px; text-transform: uppercase;">${n.category}</span>
              <span class="font-label-sm text-outline text-muted text-xs">${n.time || 'Recent'}</span>
              ${n.unread ? '<span class="badge badge-accent" style="font-size: 9px;">New</span>' : ''}
            </div>
            <h4 class="font-title-md" style="font-size: 15px; font-weight: 700; color: var(--color-espresso); margin: 0 0 2px;">${n.title}</h4>
            <p class="font-body-sm text-outline text-muted" style="margin: 0; font-size: 13px;">${n.text}</p>
          </div>
        </div>
        <div class="flex items-center gap-xs flex-shrink-0">
          ${n.unread ? `
            <button class="btn btn-sm btn-subtle" onclick="NotificationsController.markRead('${n.id}')" title="Mark as Read" style="padding: 4px 8px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">done</span>
            </button>
          ` : ''}
          <button class="icon-btn" onclick="NotificationsController.deleteNotification('${n.id}')" title="Dismiss">
            <span class="material-symbols-outlined" style="font-size: 18px; color: var(--outline);">close</span>
          </button>
        </div>
      </div>
    `).join('');

    this.updateCounters();
  },

  async markRead(id) {
    await Storage.markNotificationRead(id);
    this.renderFeed();
    App?.toast?.('Dispatch marked as read', 'done_all');
  },

  async markAllRead() {
    await Storage.markAllNotificationsRead();
    this.renderFeed();
    App?.toast?.('All notifications marked as read', 'done_all');
  },

  async deleteNotification(id) {
    await Storage.deleteNotification(id);
    this.renderFeed();
  },

  updateCounters() {
    const items = Storage.get(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const unread = items.filter(n => n.unread).length;

    const unreadBadge = document.getElementById('unreadNotifBadge');
    if (unreadBadge) unreadBadge.textContent = unread > 0 ? `${unread} New` : 'All Caught Up';

    const headerBadges = document.querySelectorAll('.notification-badge, .icon-badge');
    headerBadges.forEach(badge => {
      badge.style.display = unread > 0 ? 'block' : 'none';
    });
  }
};

window.NotificationsController = NotificationsController;

Storage.subscribe(STORAGE_KEYS.NOTIFICATIONS, () => {
  NotificationsController.renderFeed();
});

document.addEventListener('DOMContentLoaded', () => {
  NotificationsController.renderFeed();
});
