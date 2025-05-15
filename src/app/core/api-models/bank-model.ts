export interface Bank {
    id?: number;
    accountDisplayName?: string;
    openingBalance?: number;
    totalBalance?: number;
    asOfDate?: string;
    bankName?: string;
    isMenuVisible?: boolean;
    accountName?: string;
    accountNumber?: number;
    branch?: string;
    ifscCode?: string;
    qrCode?:string
    isDefault?: boolean;
    isQrCodeDeleted?: boolean;
}

export interface BankTransaction {
    id?: number;
    invoiceNo?: string;
    partyName?: string;
    ledgerName?: string;
    type?: string;
    journalEntryType?: string;
    paymentIn?: number;
    paymentOut?: number;
    total?: number;
    balance?: number;
    orderNumber?: string;
    orderPrefix?: string;
    orderSuffix?: string;
    date?: string;
    paymentStatus?: string
}