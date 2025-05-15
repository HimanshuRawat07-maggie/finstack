export interface DebitNote {
    id: number
    partyName: string
    amount: number
    paidAmount: number
    paymentMode: string
    orderNumber: string
    suppliersInvoiceNumber: string
    suppliersInvoiceDate: string
    phone: string
    dueDate: string
    orderDate: string
    orderSuffix: string
    orderPrefix: string
    paymentType: string
    paymentStatus: string,
    orderStatus?: string
}