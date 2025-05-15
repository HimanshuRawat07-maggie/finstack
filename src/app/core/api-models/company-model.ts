export interface State {
    name?: string;
    id?: number;
    code?: string
}

export interface CompanyType {
    name?: string;
    id?: number;
}

export interface BusinessCategory {
    id?: number;
    name?: string;
}

export interface InvoiceTemplates {
    id?: number;
    name?: string;
    path?: string;
    isDefault?:boolean
}

export interface SplitCompany {
    splitFromDate?: number;
    name?: string;
}

export interface GetInvoiceTemplate {
    themeId?: number;
    colorCode?: string;
}

export interface CompanyDetails {
    id?: number
    name?: string
    gst?: string
    businessPhone?: string
    businessEmail?: string
    trade?: string
    billingAddress?: string;
    billingAddress2?: string;
    billingPincode?: string
    billingState?: number
    billingCountry?: string
    shippingAddress?: string
    shippingPincode?: string
    shippingState?: number
    shippingCountry?: string
    pan?: string
    alternatePhone?: string
    website?: string
    tan?: string
    businessDescription?: string
    declaration?: string
    businessTypeId?: number
    businessCategoryId?: number
    cin?: string;
    msmeType?: string
    msmeRegistrationNumber?: string
    companyTypeId?: number
    companyRole?: string;
    terms?:string
}

export interface getCompanyDetails {
    id?: number;
    name?: string;
    gst?: string;
    businessPhone?: string;
    businessEmail?: string;
    tradeName?: string;
    pan?: string;
    alternatePhone?: string;
    website?: string;
    tan?: string;
    logo?: string;
    billingAddress?: BillingAddress;
    shippingAddress?: BillingAddress;
    businessTypeId?: number,
    businessCategoryId?: number,
    licenseValidUpto?: number,
    licenseType?: string;
    businessDescription?: string,
    stateId?: number;
    signature?: Array<signature>;
    msmeType?: string;
    msmeRegistrationNumber?: string;
    cin?: string;
    declaration?: string;
    companyTypeId?: number;
    terms?: string;
}

export interface signature {
    id?: number;
    signature?: string
}

interface BillingAddress {
    id?: number;
    address?: string;
    address2?: string;
    pincode?: string;
    state?: {
        id: number
        name: string
        minPincode: number
        maxPincode: number
        abbreviation: string
        code: string
    };
    country?: string;
}

export interface GetAllCompany {
    id: number
    name: string
    gst: string
    businessPhone: string
    businessEmail: string
    trade: string
    pan: string
    alternatePhone: string
    website: string
    tan: string
    logo: string
    billingAddress: BillingAddress
    shippingAddress: BillingAddress
    businessTypeId: number
    businessCategoryId: number
    businessDescription: string
    licenseValidUpto?: number;
    licenseType?: string;
}

export interface AddUser {
    name?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    companyName?: string;
    companyId?: number;
    licenseKey?: string;
    firmName?: string;
    address?: string;
}

export interface getUser {
    id?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    profilePicUrl?: string;
    selectedCompanyId?: number;
    companyRole?: string;
    companyName?: string;
    logo?: string;
    isActive?: boolean;
    companyUserId?: number;
}

export interface GstIn {
    Gstin?: string;
    tradeName?: string;
    legalName?: string;
    addrBnm?: string;
    addrBno?: string;
    addrFlno?: string;
    addrSt?: string;
    addrLoc?: string;
    stateCode?: number;
    addrPncd?: number;
    txpType?: string;
    status?: string;
    blkStatus?: string;
    Tradename?: string;
    LegalName?: string;
    dtReg?: string;
    dtDReg?: string;
}

export interface CompanyLimits {
    einvoiceBillIncreaseBy: number;
    ewayBillBalance: number;
    ewayBillRenewAmount: number;
    ewayBillIncreaseBy: number;
    einvoiceBillBalance: number;
    einvoiceBillRenewAmount: number;
}

export interface PaymentTransaction{
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?:string
}

export interface GstPortal{
    gst?: string;
    username?: string;
    password?: string;
}

