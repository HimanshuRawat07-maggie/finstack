import { State } from "./company-model";

export interface Party {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    address2?: string;
    pincode?: string;
    pfpColor?: string;
    country?: string;
    state?: number;
    gstType?: number;
    gstTypeId?: number;
    gstState?: string;
    gst?: string;
    type?: string;
    asOfDate?: string;
    amount?: number | null;
    shippingAddress?: Array<BillingAddress>;
    billingAddress?: BillingAddress;
    isMenuVisible?: boolean;
    removedShippingAddress?: number[];
    accountDisplayName?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: number;
    openingBalance?: number;
    branch?: string;
    ifscCode?: string;
    partyGroupId?: string;
    code?: string;
    alias?: string;
    pan?: string;
    fieldType?: string;
    partyTurnover?: string
}

export interface getParty {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    billingAddress?: BillingAddress;
    shippingAddress?: BillingAddress;
    companyName?: string;
    gst?: string;
    type?: string;
    asOfDate?: string;
    openingBalance?: string;
}

export interface GetPartyById {
    gstStateId?: number;
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    billingAddress?: BillingAddress;
    gstTypeId?: number;
    gstState?: string;
    gst?: string;
    type?: string;
    asOfDate?: string;
    openingBalance?: number;
}

export interface UpdatePartyById {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    gstType?: number;
    code?: string;
    gstState?: string;
    gst?: string;
    type?: string;
    asOfDate?: string;
    amount?: number | null;
}

export interface BillingAddress {
    id?: number;
    address?: string;
    address2?: string;
    pincode?: string;
    state?: State;
    country?: string;
}

export interface PartyTransaction {
    id?: number;
    identifierId?: number;
    type?: string,
    total?: number;
    balance?: number;
    orderPrefix?: string;
    orderNumber?: string;
    orderSuffix?: string;
    date?: string;
    createdOn?: Date;
    paymentStatus?: string;
    identifier?: string;

    amount?: number;
    isSelected?: boolean;
    orderDate?: string;

    paidAmount?: number;
    selectedAmount?: number;
}

export interface PartyGroup {
    name: string;
    parentGroupName: string;
    type: string;
    id: number;
    default: boolean;
}