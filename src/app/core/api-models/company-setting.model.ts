export interface CompanySetting {
    isBatchOfProductEnable?: boolean;
    isWarehouseEnable?: boolean;
    primaryWarehouseName?: string;
    primaryWarehouseAddress?: string;
    isEwayBillingEnable?: boolean;
    isEwayInvoicingEnable?: boolean;
    isManufacturingEnable?: boolean;
    isDiscountEnable?: boolean;

    saleOrderPrefix?: string;
    saleOrderSuffix?: string;
    saleOrderStartingFrom?: string;
    creditNotePrefix?: string;
    creditNoteSuffix?: string;
    creditNoteStartingFrom?: string;
    purchasePrefix?: string;
    purchaseSuffix?: string;
    purchaseStartingFrom?: string;
    purchaseOrderPrefix?: string;
    purchaseOrderSuffix?: string;
    purchaseOrderStartingFrom?: string;
    debitNotePrefix?: string;
    debitNoteSuffix?: string;
    debitNoteStartingFrom?: string;
    salePrefix?: string;
    saleSuffix?: string;
    saleStartingFrom?: string;
    taxInvoicePrefix?: string;
    taxInvoiceSuffix?: string;
    taxInvoiceStartingFrom?: string;
    posInvoicePrefix?: string;
    posInvoiceSuffix?: string;
    posInvoiceStartingFrom?: string;
    serviceInvoicePrefix?: string;
    serviceInvoiceSuffix?: string;
    serviceInvoiceStartingFrom?: string;
    paymentInPrefix?: string;
    paymentInSuffix?: string;
    paymentInStartingFrom?: string;
    paymentOutPrefix?: string;
    paymentOutSuffix?: string;
    paymentOutStartingFrom?: string;
    journalPrefix?: string;
    journalSuffix?: string;
    journalStartingFrom?: string;
    expensePrefix?: string;
    expenseSuffix?: string;
    expenseStartingFrom?: string;
}

export interface CompanySettings {
    'pdf.mfg.enabled'?:string
    'pdf.exp.enabled'?:string
    'pdf.barcode.enabled'?:string
    'pdf.batchname.enabled'?:string
    'batch.enabled'?: string;
    'warehouse.enabled'?: string;
    'ewaybilling.enabled'?: string;
    'einvoicing.enabled'?: string;
    'discount.enabled'?: string;
    'manufacturing.enabled'?: string;
    'logs.enabled'?: string;
    'showdeleted.enabled'?: string;

    'saleorder.prefix'?: string;
    'saleorder.suffix'?: string;
    'saleorder.startingfrom'?: string;
    'creditnote.prefix'?: string;
    'creditnote.suffix'?: string;
    'creditnote.startingfrom'?: string;
    'challanin.prefix'?: string;
    'challanin.suffix'?: string;
    'challanin.startingfrom'?: string;
    'purchase.prefix'?: string;
    'purchase.suffix'?: string;
    'purchase.startingfrom'?: string;
    'purchaseorder.prefix'?: string;
    'purchaseorder.suffix'?: string;
    'purchaseorder.startingfrom'?: string;
    'debitnote.prefix'?: string;
    'debitnote.suffix'?: string;
    'debitnote.startingfrom'?: string;
    'sale.prefix'?: string;
    'sale.suffix'?: string;
    'sale.startingfrom'?: string;
    'challanout.startingfrom'?: string;
    'challanout.prefix'?: string;
    'challanout.suffix'?: string;
    'taxinvoice.prefix'?: string;
    'taxinvoice.suffix'?: string;
    'taxinvoice.startingfrom'?: string;
    'posinvoice.prefix'?: string;
    'posinvoice.suffix'?: string;
    'posinvoice.startingfrom'?: string;
    'serviceinvoice.prefix'?: string;
    'serviceinvoice.suffix'?: string;
    'serviceinvoice.startingfrom'?: string;
    'paymentin.prefix'?: string;
    'paymentin.suffix'?: string;
    'paymentin.startingfrom'?: string;
    'paymentout.prefix'?: string;
    'paymentout.suffix'?: string;
    'paymentout.startingfrom'?: string;
    'journal.prefix'?: string;
    'journal.suffix'?: string;
    'journal.startingfrom'?: string;
    'expense.prefix'?: string;
    'expense.suffix'?: string;
    'expense.startingfrom'?: string;

    'finyear.startingfrom'?: string;
    'book.startingfrom'?: string;
}