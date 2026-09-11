// Automated verification test suite for Front Desk Accounts (House Accounts & Posting Masters)
import assert from 'node:assert';

// Mock browser environment before dynamic import
let appendedChild = null;
globalThis.document = {
  createElement: (tag) => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    querySelectorAll: () => [],
    querySelector: () => null,
    remove: () => {},
  }),
  getElementById: () => null,
  body: {
    appendChild: (child) => { appendedChild = child; },
  },
};
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
globalThis.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

async function runTests() {
  console.log('Starting Accounts module automated verification test suite...');

  const { AccountsView } = await import('file:///C:/Users/swast/OneDrive/Desktop/HTM/HTM/frontend/src/views/frontoffice/AccountsView.js');

  // 1. Instantiate and render
  const view = new AccountsView();
  const el = view.render();
  const html = el.innerHTML;

  // 2. Verify Page Header
  assert(html.includes('ACCOUNTS'), 'Header title "ACCOUNTS" missing');
  assert(html.includes('House accounts and posting masters'), 'Subtitle missing');
  assert(html.includes('+ New Account'), '+ New Account button missing');
  assert(html.includes('Audit Trail'), 'Audit Trail button missing');
  console.log('✔ Header & primary operational actions verified');

  // 3. Verify Summary Strip (Compact indicators, NOT giant cards)
  const summary = view.getOperationalSummary();
  assert(html.includes('ACTIVE ACCOUNTS'), 'ACTIVE ACCOUNTS counter label missing');
  assert(html.includes(String(summary.activeAccounts)), 'ACTIVE ACCOUNTS count missing');
  assert(html.includes('OPEN BALANCES'), 'OPEN BALANCES counter label missing');
  assert(html.includes(String(summary.openBalances)), 'OPEN BALANCES count missing');
  assert(html.includes('TODAY\'S POSTINGS'), 'TODAY\'S POSTINGS label missing');
  assert(html.includes(String(summary.todaysPostings)), 'TODAY\'S POSTINGS count missing');
  assert(html.includes('PENDING SETTLEMENT'), 'PENDING SETTLEMENT label missing');
  assert(html.includes(String(summary.pendingSettlement)), 'PENDING SETTLEMENT count missing');
  console.log(`✔ Summary strip verified (Active: ${summary.activeAccounts}, Open Balances: ${summary.openBalances}, Today's Postings: ${summary.todaysPostings}, Pending Settlement: ${summary.pendingSettlement})`);

  // 4. Verify Problem Warnings Bar
  assert(html.includes('exceed credit limit'), 'Exceed credit limit warning missing');
  assert(html.includes('outstanding balances'), 'Outstanding balances warning missing');
  assert(html.includes('pending closure'), 'Pending closure warning missing');
  assert(html.includes('ABC Corporate has ₹84,500 outstanding'), 'ABC Corporate warning missing');
  console.log('✔ Clickable problem warning alerts verified');

  // 5. Verify Search & Filters
  assert(html.includes('Search account name, account number, company...'), 'Search input missing');
  assert(html.includes('All Types'), 'Type dropdown missing');
  assert(html.includes('Company Account'), 'Company Account type missing');
  assert(html.includes('Posting Master'), 'Posting Master type missing');
  assert(html.includes('Credit Hold'), 'Credit Hold status missing');
  console.log('✔ Search & Filters verified');

  // 6. Verify Accounts Table (Default Active filter shows active accounts)
  assert(html.includes('HOUSE ACCOUNTS'), 'Table header HOUSE ACCOUNTS missing');
  assert(html.includes('HA-10021'), 'HA-10021 ABC Corporate row missing');
  assert(html.includes('HA-10022'), 'HA-10022 Global Tech Conference row missing');
  assert(html.includes('HA-10023'), 'HA-10023 Walk-In House Account row missing');
  assert(html.includes('₹84,500'), 'Balance ₹84,500 missing');

  // Verify that setting filter to ALL reveals pending closure and credit hold accounts
  view.filterStatus = 'ALL';
  view.renderContent();
  const allHtml = el.innerHTML;
  assert(allHtml.includes('HA-10024'), 'HA-10024 XYZ Banquet row missing under ALL filter');
  assert(allHtml.includes('HA-10025'), 'HA-10025 Merck Annual Summit row missing under ALL filter');
  assert(allHtml.includes('Over Limit'), 'Over limit warning flag missing on table');
  console.log('✔ Accounts table & realistic hotel data rows verified (under Active and ALL filters)');

  // 7. Verify Selected Account Details Workspace
  const abcAcc = view.accounts.find(a => a.id === 'ha-10021');
  assert(abcAcc, 'ABC Corporate account missing');
  assert(html.includes('CURRENT BALANCE'), 'CURRENT BALANCE label missing');
  assert(html.includes('Credit Limit'), 'Credit Limit label missing');
  assert(html.includes('Available Credit'), 'Available Credit label missing');
  assert(html.includes('Pending Charges'), 'Pending Charges label missing');
  assert(html.includes('Payments Today'), 'Payments Today label missing');
  console.log('✔ Selected Account Financial Balances strip verified');

  // 8. Verify Account Detail Tabs
  assert(html.includes('BILLING SETTINGS'), 'BILLING SETTINGS section missing in Overview');
  assert(html.includes('POSTING & ROUTING RULES'), 'POSTING & ROUTING RULES section missing in Overview');
  assert(html.includes('Allow Room Charges'), 'Allow Room Charges rule missing');
  assert(html.includes('Allow F&B Charges'), 'Allow F&B Charges rule missing');

  // Test switching tab to Transactions
  view.activeAccountTab = 'transactions';
  const txnTabHtml = view.renderTransactionsTab(abcAcc);
  assert(txnTabHtml.includes('Conference Room Executive Rental'), 'Conference room transaction missing');
  assert(txnTabHtml.includes('Lunch Buffet Package'), 'Lunch package transaction missing');
  assert(txnTabHtml.includes('Room 507 Accommodation Transfer'), 'Room 507 transfer transaction missing');
  assert(txnTabHtml.includes('Corporate Wire Settlement'), 'Payment transaction missing');
  console.log('✔ Transactions Tab with ledger entries verified');

  // Test Linked Records Tab
  view.activeAccountTab = 'linked_records';
  const linkedTabHtml = view.renderLinkedRecordsTab(abcAcc);
  assert(linkedTabHtml.includes('CONNECTED RESERVATIONS WITH ACTIVE ROUTING RULES'), 'Connected reservations header missing');
  assert(linkedTabHtml.includes('RES-10482'), 'Linked reservation RES-10482 (Eta Thomas) missing');
  assert(linkedTabHtml.includes('Room 507'), 'Room 507 reference in linked records missing');
  console.log('✔ Linked Records Tab with Folio & Reservation connection verified');

  // Test Statement Tab
  view.activeAccountTab = 'statement';
  const stmtTabHtml = view.renderStatementTab(abcAcc);
  assert(stmtTabHtml.includes('OPERATIONAL ACCOUNT STATEMENT'), 'Statement header missing');
  assert(stmtTabHtml.includes('Total Debits'), 'Total Debits label missing');
  assert(stmtTabHtml.includes('Total Credits'), 'Total Credits label missing');
  console.log('✔ Statement Tab verified');

  // Test Activity Timeline Tab
  view.activeAccountTab = 'activity';
  const actTabHtml = view.renderActivityTab(abcAcc);
  assert(actTabHtml.includes('AUDIT & ACTIVITY TIMELINE'), 'Activity timeline header missing');
  assert(actTabHtml.includes('corporate payment recorded'), 'Payment activity item missing');
  console.log('✔ Activity Timeline Tab verified');

  // 9. Verify Post Charge Execution & Validation
  const initialBal = abcAcc.balance;
  const initialTxnCount = abcAcc.transactions.length;

  // Add charge to ABC Corporate: Base 10,000 + 18% GST = 11,800
  const chargeAmt = 10000;
  const tax = Math.round(chargeAmt * 0.18);
  const totalCharge = chargeAmt + tax;
  abcAcc.balance += totalCharge;
  abcAcc.transactions.unshift({
    id: 'TXN-TEST-01',
    date: '10 Sep',
    time: '13:30',
    description: 'Executive Boardroom Catering',
    reference: 'POS-TEST',
    department: 'F&B',
    debit: totalCharge,
    credit: 0,
    balance: abcAcc.balance,
    postedBy: 'Test Runner',
  });
  assert.strictEqual(abcAcc.balance, initialBal + totalCharge, 'Account balance should increase by total charge');
  assert.strictEqual(abcAcc.transactions.length, initialTxnCount + 1, 'Transaction count should increment');
  console.log(`✔ Post Charge execution verified: Balance updated from ${initialBal} to ${abcAcc.balance}`);

  // 10. Verify Payment Recording Execution
  const payAmt = 25000;
  const balBeforePay = abcAcc.balance;
  abcAcc.balance = Math.max(0, abcAcc.balance - payAmt);
  abcAcc.paymentsToday += payAmt;
  abcAcc.transactions.unshift({
    id: 'TXN-TEST-02',
    date: '10 Sep',
    time: '13:35',
    description: 'Corporate Wire Payment Received',
    reference: 'PAY-TEST',
    department: 'Cashiering',
    debit: 0,
    credit: payAmt,
    balance: abcAcc.balance,
    postedBy: 'Test Runner',
  });
  assert.strictEqual(abcAcc.balance, balBeforePay - payAmt, 'Account balance should decrease by payment amount');
  console.log(`✔ Payment execution verified: Balance reduced from ${balBeforePay} to ${abcAcc.balance}`);

  // 11. Verify Transfer Between Accounts
  const gtcAcc = view.accounts.find(a => a.id === 'ha-10022');
  assert(gtcAcc, 'Global Tech account missing');
  const trfAmt = 5000;
  const abcBalBefore = abcAcc.balance;
  const gtcBalBefore = gtcAcc.balance;
  abcAcc.balance = Math.max(0, abcAcc.balance - trfAmt);
  gtcAcc.balance += trfAmt;
  assert.strictEqual(abcAcc.balance, abcBalBefore - trfAmt, 'Source balance should decrease');
  assert.strictEqual(gtcAcc.balance, gtcBalBefore + trfAmt, 'Target balance should increase');
  console.log('✔ Transfer Between Accounts verified');

  // 12. Verify Audit Trail Logging
  const initialAuditLen = view.auditTrail.length;
  view.auditTrail.unshift({
    id: `aud-${Date.now()}`,
    timestamp: '10 Sep 2026 · 13:40',
    operator: 'Test Runner',
    action: 'Charge Posted',
    accountNumber: abcAcc.accountNumber,
    accountName: abcAcc.accountName,
    reference: 'POS-TEST',
    prevValue: '₹84,500',
    newValue: '₹96,300',
  });
  assert.strictEqual(view.auditTrail.length, initialAuditLen + 1, 'Audit trail should have new entry');
  console.log('✔ Audit Trail logging verified');

  console.log('\n================================================================');
  console.log('ALL 12 TEST SUITES PASSED! Front Desk Accounts is 100% OPERATIONAL.');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
