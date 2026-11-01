/**
 * EVARA Private Concierge — Checklist & Timeline Controller
 * Coordinates milestone tracking, task completions, and event readiness calculations.
 */

const ChecklistController = {
  async init() {
    this.bindEvents();
    this.syncFromStorage();
  },

  syncFromStorage() {
    const tasks = Storage.get(STORAGE_KEYS.CHECKLIST, DEFAULT_CHECKLIST);
    const checkboxes = document.querySelectorAll('.task-checkbox');

    checkboxes.forEach((cb, index) => {
      const task = tasks[index];
      if (task) {
        cb.setAttribute('data-task-id', task.id);
        cb.checked = Boolean(task.completed);
        const card = cb.closest('.card') || cb.closest('.task-card');
        const title = card ? (card.querySelector('.task-title') || card.querySelector('strong')) : null;
        if (title) {
          if (cb.checked) {
            title.style.textDecoration = 'line-through';
            title.style.opacity = '0.5';
          } else {
            title.style.textDecoration = 'none';
            title.style.opacity = '1';
          }
        }
      }
    });

    this.updateCounters();
  },

  bindEvents() {
    document.querySelectorAll('.task-checkbox').forEach((cb, index) => {
      cb.addEventListener('change', async (e) => {
        const taskId = cb.getAttribute('data-task-id') || `tsk-${index + 1}`;
        const isChecked = e.target.checked;

        const card = e.target.closest('.card') || e.target.closest('.task-card');
        const title = card ? (card.querySelector('.task-title') || card.querySelector('strong')) : null;
        if (title) {
          if (isChecked) {
            title.style.textDecoration = 'line-through';
            title.style.opacity = '0.5';
            App?.toast?.('Milestone marked complete and vaulted', 'task_alt');
          } else {
            title.style.textDecoration = 'none';
            title.style.opacity = '1';
          }
        }

        await Storage.toggleChecklistTask(taskId, isChecked);
        this.updateCounters();
      });
    });
  },

  updateCounters() {
    const tasks = Storage.get(STORAGE_KEYS.CHECKLIST, DEFAULT_CHECKLIST);
    const total = tasks.length || 6;
    const completed = tasks.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressFill = document.querySelector('.progress-bar-fill');
    if (progressFill) progressFill.style.width = `${pct}%`;

    const velocityEl = document.querySelector('.text-success.font-bold');
    if (velocityEl && velocityEl.textContent.includes('%')) {
      velocityEl.textContent = `${pct}% Velocity`;
    }
  }
};

window.ChecklistController = ChecklistController;

Storage.subscribe(STORAGE_KEYS.CHECKLIST, () => {
  ChecklistController.syncFromStorage();
});

document.addEventListener('DOMContentLoaded', () => {
  ChecklistController.init();
});

