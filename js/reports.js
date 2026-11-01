/**
 * EVARA Private Concierge — Reports & Data Export Engine
 * Generates audit statements, client analytics, and CSV exports using vanilla JavaScript.
 */

const ReportsController = {
  exportCSV(type = 'financial') {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = 'evara-report.csv';

    if (type === 'financial') {
      filename = 'EVARA-Villa-San-Valentino-Ledger.csv';
      const expenses = Storage.get(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      csvContent += 'Transaction ID,Title,Category,Amount (INR),Status,Payee,Date\n';
      expenses.forEach(e => {
        csvContent += `"${e.id}","${e.title}","${e.category}",${e.amount},"${e.status}","${e.payee}","${e.date}"\n`;
      });
    } else if (type === 'guests') {
      filename = 'EVARA-Guest-Roster-RSVP.csv';
      const guests = Storage.get(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
      csvContent += 'Guest ID,Name,Email,RSVP Status,Pax,Table Allocation,Dietary,Contribution (INR),Payment Status\n';
      guests.forEach(g => {
        csvContent += `"${g.id}","${g.name}","${g.email}","${g.rsvp}",${g.pax},"${g.table}","${g.dietary}",${g.contribution},"${g.paymentStatus}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    App.toast(`Exported ${filename} successfully.`, 'file_download');
  },
  exportGuestsCSV() {
    this.exportCSV('guests');
  },
  exportFinancialCSV() {
    this.exportCSV('financial');
  }
};

window.ReportsController = ReportsController;
window.Reports = ReportsController;
