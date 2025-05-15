export interface SalePurchase {
    id?: number;

    partyId?: number;
    partyName?: string;
    ledgerName?: string;
    alias?: string;
    ledgerId?: number;
    phone?: string;
    email?: string;
    items?: Array<SalePurchaseItem>;
    totalAmount?: number;
    totalAmountWithRoundOff?: number;
    advanceAmount?: number;
    balanceAmount?: number;
    amount?: number;
    signatureId?: number;

    hasReceivedAdvance?: boolean;
    hasRoundOff?: boolean;
    roundOff?: number;

    description?: string;
    notes?: string;
    terms?: string;
    refNumber?: string;
    paymentMode?: string;

    orderDate?: string | null;
    dueDate?: string | null;
    orderNumber?: string;
    stateId?: number;
    hasTax?: boolean;
    orderPrefix?: string
    orderSuffix?: string
    billingAddress?: string;
    shippingAddress?: string;
    billingAddress2?: string;
    shippingAddress2?: string;

    totalDiscount?: number;
    totalTax?: number;
    paymentTypeId?: number;

    suppliersInvoiceNumber?: string;
    suppliersInvoiceDate?: string;

    expenseCategoryName?: string;
    hasGst?: boolean;

    transactions?: Array<LinkedTransaction>;
    customerName?: string;
    referenceId?: number;

    billingPincode?: string;
    billingStateId?: number;
    shippingPincode?: string;
    shippingStateId?: number;


    paymentDate?: string;
    paymentReference?: string;

    igst?: number;
    cgst?: number;
    sgst?: number;
    amountInWords?: string;
    exportAndDispatchDetails?: ExportDispatch;
    ledgers?: Array<SalePurchaseItem>;
}

export interface SalePurchaseItem {
    id?: number;
    name: string;
    qty: number;
    price: number;
    discountInPercent: number;
    discountInRupees: number;
    purchasePrice?:number
    sellingPrice?:number
    taxId: number;
    taxName: string;
    taxAmount: number;
    taxPercent: number;
    totalAmount: number
    hsnCode: string;
    unit?: string;
    batchName?: string;
    mfgDate?: string;
    barCode?: string;
    expDate?: string;
    description?:string
    warehouseName?: string;

    type?: string;
}

export interface LinkedTransaction {
    transactionId: number;
    amount: number;
}

export interface ExportDispatch {
    placeOfReceiptByShipper?: string;
    shippingBillNumber?: string;
    shippingBillDate?: string;
    vesselFlightNumber?: string;
    billOfEntryNumber?: string;
    billOfEntryDate?: string;
    portOfLoading?: string;
    portCode?: string;
    portOfDischarge?: string;
    countryNumber?: string;
    
    deliveryNote?: string;
    dispatchDocNumber?: string;
    dispatchedThrough?: string;
    destination?: string;
    agentCarrierName?: string;
    billOfLading?: string;
    billOfLadingDate?: string;
    motorVehicleNumber?: string
    supplyTypeCode?:string
}

export interface Expense {
    id?: number;
    ledger?: string;
    pricePerUnit?: number;
    discountInPercent?: number;
    discountInRupees?: number;
    quantity?: number;
    gstSlabId?: number;
    taxAmount?: number;
    totalAmount?: number;
    hsnCode?: string;
}

export interface SalePurchaseApiModel {
    orderTime?: string;
    id?: number;
    partyName?: string;
    signatureId?: number;
    amount?: number;
    paidAmount?: number;
    reference?: string;
    notes?: string;
    terms?: string;
    shippingCharges?: number;
    packagingCharges?: number;
    orderNumber?: string;
    suppliersInvoiceNumber?: string;
    suppliersInvoiceDate?: string;
    phone?: string;
    stateId?: number;
    dueDate?: string;
    orderDate: string | null;
    hasTax?: boolean;
    paymentTypeId?: number;
    hasRoundedOff?: boolean;
    roundOffAmount?: number;
    discountInRupees?: number;
    orderSuffix?: string;
    orderPrefix?: string;
    taxAmount?: number;
    billingAddress?: string;
    shippingAddress?: string;
    billingAddress2?: string;
    shippingAddress2?: string;
    products?: Array<SalePurchaseProductApiModel>;
    expenseCategoryName?: string;
    hasGst?: boolean;
    transactions?: Array<LinkedTransaction>;
    customerName?: string;
    referenceId?: number;

    billingPincode?: string;
    billingStateId?: number;
    shippingPincode?: string;
    shippingStateId?: number;


    paymentMode?: string;
    paymentDate?: string;
    paymentReference?: string;

    igst?: number;
    cgst?: number;
    sgst?: number;
    amountInWords?: string;
    exportAndDispatchDetails?: ExportDispatch;
    ledgers?: Array<SalePurchaseProductApiModel>;
}

export interface SalePurchaseProductApiModel {
    id?: number;
    product?: string;
    pricePerUnit?: number;
    description?: string;
    discountInPercent?: number;
    discountInRupees?: number;
    quantity?: number;
    purchasePrice?: number;
    sellingPrice?: number;
    unit?: string;
    gstSlabId?: number;
    taxAmount?: number;
    batchName?: string;
    mfgDate?: string;
    expDate?: string;
    barCode?: string;
    batchSize?: number;
    warehouseName?: string;
    totalAmount?: number;
    hsnCode?: string;
}