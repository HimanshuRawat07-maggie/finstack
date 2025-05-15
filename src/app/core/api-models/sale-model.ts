import { State } from "./company-model";
import { GstSlab } from "./item-model";

export interface PayemntIn {
    id?: number;
    partyName?: string;
    amount?: number;
    paymentInNumber?: string;
    salesId?: number;
    paymentTypeId?: number;
    referenceNumber?: string;
    date?: string;
    description?: string;
    paymentType?: string;
    isMenuVisible?: boolean;
}

export interface GetPaymentIn {
    id?: number;
    partyId?: number;
    amount?: number;
    paymentInNumber?: string;
    salesResponseDto?: SalesResponseDto;
    paymentType?: string;
    referenceNumber?: string;
}

export interface SalesResponseDto {
    id?: number;
    paymentMode?: string;
    party?: string;
    sign?: string;
    reference?: string;
    notes?: string;
    terms?: string;
    shippingCharges?: number;
    packagingCharges?: number;
    salesNumber?: string;
    salesProductResponseDtos?: SalesProductResponseDto[];
}

export interface SalesProductResponseDto {
    id?: number;
    product?: string;
    pricePerUnit?: number;
    priceWithTax?: number;
    discountInPercent?: number;
    discountInRupees?: number;
    quantity?: number;
    unit?: string;
}

export interface SaleInvoiceGetAll {
    id?: number;
    salesOrderId?: number;
    amount?: number;
    additionalAmount?: number;
    paymentType?: string;
    partyName?: string;
    partyPhone?: string;
    customerName?: string;
    signatureUrl?: string;
    reference?: string;
    notes?: string;
    terms?: string;
    shippingCharges?: number;
    packagingCharges?: number;
    paymentStatus?: string;
    stateId?: State;
    dueDate?: string;
    orderPrefix?: string;
    orderSuffix?: string;
    orderDate?: string;
    alias?: string;
    paidAmount?: number;
    paymentMode?: string;
    orderNumber?: string;
    orderStatus?: string;
    salesProductResponseDtos?: SalesProductResponseDtos[];
    journals?: Journal[];
    ledgerName?: string;
    ewayBillId?: number;
    einvoiceId?: number;
}

export interface Journal {
    id?: number
    particularName?: string
    journalEntryType?: string
    particularId?: number
    amount?: number
    selectedPartyLedgerAndPayment?: Array<any>;
    credit?: number;
    debit?: number;
}

export interface SalesProductResponseDtos {
    id?: number;
    product?: string;
    pricePerUnit?: number;
    priceWithTax?: number;
    discountInPercent?: number;
    discountInRupees?: number;
    quantity?: number;
    unit?: string;
    gstSlab?: GstSlab;
}

export interface SaleOrderGetAll {
    id: number
    partyName: string
    sign: string
    amount: number
    paidAmount: number
    additionalAmount: number
    orderStatus: string
    references: string
    notes: string
    terms: string
    shippingCharges: number
    packagingCharges: number
    gst: string
    salesOrderNumber: string
    phone: string
    stateId: State
    dueDate: string
    orderDate: string
    orderSuffix?: string;
    orderPrefix?: string;
    orderNumber: string
    paymentType: string
    paymentMode: string
    paymentStatus: string
    productResponseDtos: SalesProductResponseDtos[]
}

export interface CreditNoteGetAll {
    id: number;
    partyName: string;
    amount: number;
    additionalAmount: number;
    paidAmount: number;
    sign: string;
    notes: string
    terms: string
    shippingCharges: number
    packagingCharges: number
    salesNumber: string
    salesReturnNumber: string
    phone: string;
    stateId: State;
    dueDate: string;
    orderSuffix: string;
    orderPrefix: string;
    orderDate: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus?: string;
    paymentType?: string;
    paymentMode: string;
    productResponseDtos: SalesProductResponseDtos[];
    einvoiceId?: number;
}

export interface EWayBill {
    id?: number;
    transporterName?: string;
    transportMode?: string;
    vehicleType?: string;
    distance?: number;
    vehicleNumber?: string;
    transportDocumentNumber?: string;
    transportDocumentDate?: string;
    transInOrGSTIN?: string;
}