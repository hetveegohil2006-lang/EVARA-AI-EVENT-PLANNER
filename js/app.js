/**
 * EVARA Private Concierge — Application Core
 * Global toasts, currency formatting, quick search, and interactive helpers.
 */

const App = {
  // Toast notifications
  toast(message, icon = 'verified') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Currency Formatter
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Modal helpers
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('open');
  },

  // Clipboard copy helper
  copyToClipboard(text, successMessage = 'Link copied to clipboard') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.toast(successMessage, 'content_copy');
      }).catch(() => {
        this._fallbackCopy(text, successMessage);
      });
    } else {
      this._fallbackCopy(text, successMessage);
    }
  },

  _fallbackCopy(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.toast(successMessage, 'content_copy');
    } catch (err) {
      this.toast('Unable to copy automatically', 'error');
    }
    textArea.remove();
  }
};

window.App = App;

// Mobile Navigation Drawer & UX Event Handlers
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.app-sidebar, aside.sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (menuBtn && sidebar) {
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const toggleSidebar = (state) => {
      const open = typeof state === 'boolean' ? state : !sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open', open);
      backdrop.classList.toggle('visible', open);
      if (open) {
        backdrop.style.opacity = '1';
        backdrop.style.visibility = 'visible';
      } else {
        backdrop.style.opacity = '0';
        backdrop.style.visibility = 'hidden';
      }
    };

    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });

    backdrop.addEventListener('click', () => toggleSidebar(false));

    // Close drawer on navigation item selection on small screens
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 1200) {
          toggleSidebar(false);
        }
      });
    });
  }
});
