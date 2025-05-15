export interface Ledger {
    id?: number;
    name?: string;
    alias?: string;
    hsnCode?: string;
    openingBalance?: number;
    transactionType?: string;
    masterGroupId?: number;
    isMenuVisible?: boolean;
    // expenseCategoryType?: string;
    // amount?: number;
    fieldType?: string;
    masterGroupName?: string;
    totalAmount?: number;
    asOfDate?: string;
    taxId?: number;
}

export interface TransactionByLedgerId {
    id?: number;
    partyName?: string;
    ledgerName?: string;
    amount?: number;
    paidAmount?: number;
    orderNumber?: string;
    suppliersInvoiceNumber?: string;
    suppliersInvoiceDate?: string;
    phone?: string;
    dueDate?: string;
    orderDate?: string;
    particularName?: string;
    paymentType?: string;
    paymentMode?: string;
    paymentStatus?: string;
    orderStatus?: string;
    createdOn?: string;
    orderPrefix?: string;
    orderSuffix?: string;
    identifier?: string;
    amountInWords?: string;
    customerName?: string;
    alias?: string;
    followUpMessage?: string;
    followUpDate?: string;
    einvoiceId?: number;
}

export interface Group {
    id?: number;
    name?: string;
    parentGroupName?: string;
    type?: string;
    default?: boolean;
}

export interface cashLedger{
    openingBalance?: number;
    asOfDate?: string;
}