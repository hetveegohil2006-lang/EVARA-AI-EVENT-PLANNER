/**
 * EVARA Private Concierge — Budget & Financial Ledger
 * Reconciles expenditures, calculates liquid headroom, and manages Firestore expenses.
 */

const BudgetController = {
  renderLedger(filterCategory = 'all') {
    const tbody = document.getElementById('expenseTableBody') || document.getElementById('expensesTableBody');
    if (!tbody) {
      this.recalculate();
      return;
    }

    let expenses = Storage.get(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);

    if (filterCategory !== 'all') {
      expenses = expenses.filter(e => (e.category || '').toLowerCase() === filterCategory.toLowerCase());
    }

    tbody.innerHTML = expenses.map(exp => {
      const isPaid = exp.status === 'Paid' || exp.status === 'Remitted';
      return `
        <tr>
          <td>
            <div class="flex items-center gap-xs">
              <div class="feature-icon" style="width: 32px; height: 32px; background: var(--color-champagne-light); color: var(--color-espresso); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 16px;">receipt</span>
              </div>
              <div>
                <strong style="font-size: 13px; display: block; color: var(--color-espresso);">${exp.title}</strong>
                <span class="text-muted text-xs">${exp.payee || 'Artisan Direct'}</span>
              </div>
            </div>
          </td>
          <td><span class="badge badge-champagne" style="font-size: 11px;">${exp.category || 'General'}</span></td>
          <td style="text-align: right; font-weight: 700; color: var(--color-espresso);">${App?.formatINR ? App.formatINR(exp.amount) : '₹' + exp.amount}</td>
          <td><span class="text-xs font-semibold">${exp.payee || 'EVARA Vault'}</span></td>
          <td class="text-muted text-xs">${exp.date || 'Recorded'}</td>
          <td>
            <span class="badge ${isPaid ? 'badge-success' : 'badge-accent'}" style="font-size: 10px;">
              ${exp.status || 'Escrow Locked'}
            </span>
          </td>
          <td><span class="text-muted text-xs flex items-center gap-2xs"><span class="material-symbols-outlined text-[13px] text-primary">verified</span> Verified</span></td>
          <td style="text-align: right;">
            <button class="icon-btn" onclick="BudgetController.deleteExpense('${exp.id}')" title="Delete record">
              <span class="material-symbols-outlined" style="font-size: 18px; color: var(--error);">delete</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.recalculate();
  },

  recalculate() {
    const expenses = Storage.get(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
    const currEvent = Storage.getCurrentEvent();
    const targetBudget = Number(currEvent ? currEvent.targetBudget : 1500000);

    const totalDisbursed = expenses
      .filter(e => e.status === 'Remitted' || e.status === 'Paid')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const pendingEscrow = expenses
      .filter(e => e.status === 'Escrow Locked' || e.status === 'Under Review' || e.status === 'Pending Escrow')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const netLiquidReserve = Math.max(0, targetBudget - totalDisbursed - pendingEscrow);
    const headroomPercent = targetBudget > 0 ? ((netLiquidReserve / targetBudget) * 100).toFixed(1) : 0;

    const targetEl = document.getElementById('targetBudgetDisplay');
    if (targetEl && App?.formatINR) targetEl.textContent = App.formatINR(targetBudget);

    const disbursedEl = document.getElementById('disbursedExpensesDisplay');
    if (disbursedEl && App?.formatINR) disbursedEl.textContent = '-' + App.formatINR(totalDisbursed);

    const escrowEl = document.getElementById('pendingEscrowDisplay');
    if (escrowEl && App?.formatINR) escrowEl.textContent = '-' + App.formatINR(pendingEscrow);

    const liquidEl = document.getElementById('liquidReserveDisplay');
    if (liquidEl && App?.formatINR) liquidEl.textContent = App.formatINR(netLiquidReserve);

    const headroomBadge = document.getElementById('headroomBadge');
    if (headroomBadge) headroomBadge.textContent = `${headroomPercent}% Headroom`;

    const progressFill = document.getElementById('budgetProgressFill');
    if (progressFill && targetBudget > 0) {
      const utilizedPercent = Math.min(100, (((totalDisbursed + pendingEscrow) / targetBudget) * 100));
      progressFill.style.width = `${utilizedPercent}%`;
    }
  },

  async addExpense(event) {
    if (event) event.preventDefault();
    const title = document.getElementById('expTitle')?.value?.trim() || document.getElementById('expenseTitle')?.value?.trim();
    const category = document.getElementById('expCategory')?.value || document.getElementById('expenseCategory')?.value || 'General';
    const amount = parseFloat(document.getElementById('expAmount')?.value || document.getElementById('expenseAmount')?.value || '0');
    const payee = document.getElementById('expVendor')?.value?.trim() || document.getElementById('expensePayee')?.value?.trim() || 'Artisan Direct';
    const status = document.getElementById('expStatus')?.value || 'Pending Escrow';

    if (!title || !amount) {
      App?.toast?.('Please specify expense description and amount in INR', 'error');
      return;
    }

    const newExpense = {
      title,
      category,
      amount,
      payee,
      status,
      date: new Date().toISOString().split('T')[0]
    };

    await Storage.addExpense(newExpense);

    const modal = document.getElementById('expenseModal') || document.getElementById('addExpenseModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('open');
    }

    const form = document.getElementById('recordExpenseForm');
    if (form) form.reset();

    this.renderLedger();
    App?.toast?.(`Expense record vaulted: ${App?.formatINR ? App.formatINR(amount) : '₹' + amount}`, 'account_balance_wallet');
  },

  async deleteExpense(id) {
    if (!confirm('Are you sure you wish to delete this expense entry?')) return;
    await Storage.deleteExpense(id);
    this.renderLedger();
    App?.toast?.('Expense entry removed from financial ledger', 'delete');
  }
};

window.BudgetController = BudgetController;

Storage.subscribe(STORAGE_KEYS.EXPENSES, () => {
  BudgetController.renderLedger();
});

document.addEventListener('DOMContentLoaded', () => {
  BudgetController.renderLedger();
});
