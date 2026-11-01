/**
 * EVARA Private Concierge — Navigation Engine
 * Manages active routes, mobile drawer, sidebar scope, and user header synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileDrawer();
  syncHeaderData();
});

// Reactively re-sync on storage changes
if (window.Storage) {
  Storage.subscribe(STORAGE_KEYS.EVENTS, syncHeaderData);
  Storage.subscribe(STORAGE_KEYS.CURRENT_EVENT_ID, syncHeaderData);
  Storage.subscribe(STORAGE_KEYS.USER, syncHeaderData);
  Storage.subscribe(STORAGE_KEYS.NOTIFICATIONS, syncHeaderData);
}

function initNavigation() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item, .nav-link, .sidebar-link');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    const pageName = href.split('/').pop().replace('.html', '');
    const currentFile = currentPath.split('/').pop().replace('.html', '') || 'index';

    if (currentFile === pageName || (currentFile === '' && pageName === 'index')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.app-sidebar, aside.sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (!toggleBtn || !sidebar) return;

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('active');
  });

  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('active');
  });
}

function syncHeaderData() {
  if (!window.Storage) return;

  const currEvent = Storage.getCurrentEvent();
  if (currEvent) {
    const scopeTitles = document.querySelectorAll('.header-scope-title, .scope-title, .header-scope-title span:first-child');
    scopeTitles.forEach(el => {
      if (el.tagName === 'SPAN' || el.children.length === 0) {
        el.textContent = currEvent.title;
      }
    });

    const scopeValues = document.querySelectorAll('.scope-value');
    scopeValues.forEach(el => {
      el.textContent = currEvent.title;
    });

    const scopeDates = document.querySelectorAll('.header-scope-subtitle');
    scopeDates.forEach(el => {
      el.textContent = currEvent.dates || `${currEvent.startDate} – ${currEvent.endDate}`;
    });
  }

  // User Profile in Top Bar
  const user = Storage.get(STORAGE_KEYS.USER, DEFAULT_USER);
  if (user) {
    const profileNames = document.querySelectorAll('.profile-name');
    profileNames.forEach(el => {
      el.textContent = user.name || user.displayName || 'Eleanor Vance';
    });

    const userAvatars = document.querySelectorAll('.profile-chip .user-avatar, .profile-avatar');
    userAvatars.forEach(el => {
      const name = user.name || user.displayName || 'EV';
      el.textContent = name.split(' ').map(n => n[0]).slice(0, 2).join('');
    });
  }

  // Notifications Badge Count
  const notifs = Storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  const unreadCount = notifs.filter(n => n.unread).length;
  const badges = document.querySelectorAll('.notification-badge, .icon-badge');
  badges.forEach(b => {
    b.style.display = unreadCount > 0 ? 'block' : 'none';
  });
}
