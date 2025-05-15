export interface ReceivableReport {
    id: number
    date: string
    invoiceNo: string
    reference: string
    partyName: string
    orderPrefix: string
    orderSuffix:string
    ledgerName: string
    customerName: string
    type: string
    totalAmount: number
    paymentType: string
    paidAmount: number
    receiveAmount: number
    balance: number
    runningAmount: number;
    dueDate: string
    status: string
    description: string
    runningBalance?: number
}

export interface Tds {
  id: number
  date: string
  reference: string
  partyName: string
  ledgerName: string
  type: string
    totalAmount: number
    debit?: number
    credit?:number
  paymentType: string
  paidAmount: number
  receiveAmount: number
  balance: number
  runningAmount: number
  dueDate: string
  status: string
  invoiceNo: string
  description: string
  customerName: string
}


export interface cancelEInvoice{
    id?: number;
    reason?: number;
}

export interface GSTR1 {
  title: string
  transactions: number
  taxableAmount: number
  igst: number
  cgst: number
  sgst: number
}

export interface PurchaseReport {
    id:number
    date: string
    orderNo: string
    invoiceNo: string
    orderPrefix: string
    orderSuffix: string
    taxableAmount:number
    partyName: string
    partyPhoneNo: string
    totalAmount: number
    quantity:number
    runningBalance: number
    expenseAmount:number
    
    igst: number;
    cgst: number;
    sgst: number;
    paymentType: string
    received_PaidAmount: number
    receivedAmount: number
    balanceDue: number
    dueDate: string
    status: string
    orderStatus: string;
    paymentStatus: string
    description: string
    type: string
}

export interface StockSummary {
    name: string;
    groupName: string;
    openingBalance: StockData;
    inward: StockData;
    outward: StockData;
    closingBalance: StockData;
}

export interface StockData {
    id: number;
    name: string;
    quantity: number;
    stockValue: number;
}

export interface StockSummaryReport {
    productName: string
    date: string
    productGroup: string
    warehouseName: string
    adjustFrom: string
    batchName: string
    salePrice: number
    purchasePrice: number
    stockQuantity: number
    stockValue: number
}

export interface GroupReport {
    productName: string;
    date: string;
    type: string;
    invoiceNo: string;
    orderNumber: string;
    productGroup: string;
    adjustFromBatch: string;
    adjustFromWarehouse: string;
    warehouseName: string;
    atPrice: number;
    batchName: string;
    salePrice: number;
    purchasePrice: number;
    stockQuantity: number;
    stockValue: number;
    currentQuantity: number;
    expDate: string;
    mfgDate: string
}

export interface DayBookReport {
    id: number;
    partyName: string;
    ledgerName: string;
    particularName: string;
    customerName: string;
    date: string;
    invoiceNo: string;
    type: string;
    amount: number;
    paymentType: string;
    total: number;
    moneyIn: number;
    moneyOut: number;
    description: string;
}

export interface CashBook {
    id:number
    date: string;
    invoiceNo: string;
    partyName: string;
    ledgerName: string;
    customerName: string;
    category: string;
    type: string;
    cashIn: number;
    cashOut: number;
    runningBalance: number;
    runningAmount: number;
    clearingDate: string;
    companyPartyTransactionId: number;
    paymentReference: string;
    bankBalance: number;
    paymentype: string;
    paymentMode: string;
    totalAmount: number;
}

export interface ReconcileDate {
    id: number;
    clearingDate: string;
}

export interface FollowUpReport {
    id: number;
    partyId: number;
    partyName: string;
    ledgerName: string;
    amount: number;
    paidAmount: number;
    orderNumber: string;
    suppliersInvoiceNumber: string;
    suppliersInvoiceDate: string;
    phone: string;
    dueDate: string;
    orderDate: string;
    paymentType: string;
    paymentMode: string;
    paymentStatus: string;
    orderStatus: string;
    createdOn: string;
    orderPrefix: string;
    orderSuffix: string;
    type: string;
    identifier: string;
    amountInWords: string;
    customerName: string;
    followUpMessage: string;
    followUpDate: string;
    lastFollowUp: string
    einvoiceId: number;
}

export interface FollowUp {
    id?: number;
    transactionId?: number;
    description?: string;
    followUpDate?: string;
}

export interface TrialBalanceItem {
    title: string;
    debitAmount: number;
    creditAmount: number;
    children: Array<TrialBalanceItem>;

    isExpanded?: boolean;
    depth?: number;
    type?: string;
    closingBalance?: number;
    openingBalance?: number;
    netAmount?: number;

    closingCreditBalance?: number;
    closingDebitBalance?: number;
    openingDebitBalance?: number;
    openingCreditBalance?: number;
}

export interface JournalReport {
    id: number;
    partyName: string;
    ledgerName: string;
    amount: number;
    paidAmount: number;
    runningAmount: number;
    orderNumber: string;
    suppliersInvoiceNumber: string;
    suppliersInvoiceDate: string;
    phone: string;
    dueDate: string;
    orderDate: string;
    particularName: string
    paymentType: string;
    paymentMode: string;
    paymentStatus: string;
    orderStatus: string;
    createdOn: string;
    orderPrefix: string;
    orderSuffix: string;
    identifier: string;
    amountInWords: string;
    customerName: string;
    followUpMessage: string;
    followUpDate: string;
    paymentReference: string;
    einvoiceId: number;
}

export interface GroupWiseTransaction {
    id: number;
    date: string;
    reference: string;
    partyName: string;
    ledgerName: string;
    type: string;
    totalAmount: number;
    paymentType: string;
    paidAmount: number;
    receiveAmount: number;
    balance: number;
    runningAmount: number;
    dueDate: string;
    status: string;
    invoiceNo: string;
    description: string;
}

export interface LedgerReportTransaction {
    id: number;
    date: string;
    reference: string;
    partyName: string;
    ledgerName: string;
    type: string;
    totalAmount: number;
    paymentType: string;
    paidAmount: number;
    receiveAmount: number;
    balance: number;
    runningAmount: number;
    dueDate: string;
    status: string;
    invoiceNo: string;
    description: string;
    sgst: string;
    igst: string;
    cgst: string
}

export interface ItemWiseAgeing {
    name: string;
    groupName: string;
    totalQuantity: number;
    lessThan6: LessThan45;
    between45To9: LessThan45;
    greaterThan6: LessThan45;
}

export interface LessThan45 {
    id: number;
    name: string;
    quantity: number;
    stockValue: number;
}

export interface LogHistory {
    eventName: string;
    entityName: string;
    logs: string;
    entityId: number;
    oldJson: string;
    newJson: string;
    date: string;
}

export interface StockJournalReport {
    id: number;
    productName: string;
    date: string;
    type: string;
    productGroup: string;
    particular: string;
    adjustFromBatch: string;
    adjustFromWarehouse: string;
    warehouseName: string;
    batchName: string;
    productStorageCategory: string;
    salePrice: number;
    purchasePrice: number;
    partyName: string;
    customerName: string;
    stockQuantity: number;
    stockValue: number;
    currentQuantity: number;
    atPrice: number;
    openingStock: number;
    closingStock: number;
    expDate: string;
    mfgDate: string;
    transactionType: string;
    orderNumber: string;
    transactionId: number;
}