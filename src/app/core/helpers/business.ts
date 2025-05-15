import { UserPermissions } from "../api-models/permission-model";
import { Constants } from "../constants/app-constant";
import { SalePurchase, SalePurchaseApiModel, SalePurchaseItem } from "../models/sale-purchase-template";

export class BusinessHelpers {
    
    static permissions: Array<string> = ['dashboard', 'company', 'item', 'item group', 'warehouse', 'party', 'bank', 'sale order', 'challan out', 'sale assets',
        'sale invoice','tax invoice', 'pos invoice', 'service invoice','export invoice', 'credit note', 'purchase order','challan in','purchase assets', 'purchase bills', 'debit note', 'payment in', 'payment out', 'journal',
        'ledger', 'master group', 'financial statements report', 'accounts report', 'outstanding management report',
        'stock report', 'statutory report', 'company settings'];
    static ones: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    static teens: string[] = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    static tens: string[] = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    static getTransactionTypeValue(transactionType: string | undefined | null): string {
        switch (transactionType) {
            case 'ADD_ADJUSTMENT':
                return 'Add Stock';
            case 'REDUCE_ADJUSTMENT':
                return 'Reduce Stock';
            case 'OPENING_BALANCE':
                return 'Opening Stock'
            default:
                return '';
        }
    }

    static initNewItem(): SalePurchaseItem {
        return {
            name: '',
            qty: 0,
            price: 0,
            discountInPercent: 0,
            discountInRupees: 0,
            taxId: -1,
            taxName: '',
            taxAmount: 0,
            taxPercent: 0,
            unit: '',
            totalAmount: 0,
            hsnCode: ''
        };
    }

    static openTransactionType(type:string):string {
    if (type != 'Opening Balance') {
      if (type == 'Purchase') {
        return '/app/purchase/bills/edit/'
      } else if (type == 'Sale Order') {
       return '/app/sale/order/edit/'
      } else if (type == 'Payment-Out') {
        return '/app/other-entries/edit-payment-out/';
      } else if (type == 'Purchase Order') {
        return '/app/purchase/order/edit/'
      } else if (type == 'Debit Note') {
        return '/app/purchase/debit-note/edit/';
      } else if (type == 'Sale') {
        return '/app/sale/invoice/edit/';
      } else if (type == 'Credit Note') {
        return '/app/sale/credit-note/edit/';
      } else if (type == 'POS') {
        return '/app/sale/pos_invoice/edit/';
      } else if (type == 'Tax Invoice') {
        return '/app/sale/tax-invoice/edit/';
      } else if (type == 'Service Invoice') {
        return '/app/sale/service_invoice/edit/';
      } else if (type == 'Journal') {
        return '/app/other-entries/journal/edit/';
      } else if (type == 'Service Invoice') {
        return '/app/sale/service_invoice/edit/';
      } else if (type == 'Payment-In') {
          return '/app/other-entries/edit-payment-in/';
      } else if (type=='Sales Asset') {
          return '/app/sale/assets/edit/';
      } else if (type=='Purchase Asset') {
          return '/app/purchase/assets/edit/';
      } else if (type=='Export Invoice') {
        return '/app/sale/export-invoice/edit/';
      }else {
          return ''
      }
    } else {
        return ''
    }
    }

    static hasPermission(userPermissions: UserPermissions, permission: string, permissionValue: string): boolean {
        if (userPermissions === undefined || userPermissions === null ||
            userPermissions.permissions === undefined || userPermissions.permissions === null ||
            userPermissions.permissions[permission] === undefined || userPermissions.permissions[permission] === null) {
            return false;
        }

        return userPermissions.permissions[permission][permissionValue] == true;
    }

    static initAdminPermissions(): UserPermissions {
        let userPermissions: UserPermissions = {
            userId: 0,
            permissions: {}
        };

        this.permissions.forEach(permission => {
            userPermissions.permissions[permission] = {
                'canView': true,
                'canCreate': true,
                'canEdit': true,
                'canDelete': true,
                'canShare': true,
            }
        });
        return userPermissions;
    }

    static MapFromApiModel(orderData: SalePurchaseApiModel): SalePurchase {
        let order: SalePurchase = {
            id: orderData.id,
            partyName: orderData.partyName,
            orderDate: orderData.orderDate,
            phone: orderData.phone,
            orderNumber: orderData.orderNumber,
            refNumber: orderData.reference,
            paymentTypeId: orderData.paymentTypeId,
            terms: orderData.terms,
            totalAmountWithRoundOff: orderData.amount,
            stateId: orderData.stateId,
            advanceAmount: orderData.paidAmount,
            hasTax: orderData.hasTax,
            billingAddress: orderData.billingAddress,
            billingPincode: orderData.billingPincode,
            billingStateId: orderData.billingStateId,
            shippingAddress: orderData.shippingAddress,
            shippingPincode: orderData.shippingPincode,
            shippingStateId: orderData.shippingStateId,
            hasRoundOff: orderData.hasRoundedOff,
            roundOff: orderData.roundOffAmount,
            totalDiscount: orderData.discountInRupees,
            totalTax: orderData.taxAmount,
            paymentMode: orderData.paymentMode,
            hasReceivedAdvance: orderData.paidAmount > 0,
            balanceAmount: orderData.amount - orderData.paidAmount,
            description: orderData.notes,
            totalAmount: orderData.amount,
            orderPrefix: orderData.orderPrefix,
            orderSuffix: orderData.orderSuffix,
            customerName: orderData.customerName,
            dueDate: orderData.dueDate,
            paymentDate: orderData.paymentDate,
            paymentReference: orderData.paymentReference,

            items: [],
            ledgers: [],
            transactions: orderData.transactions,
            suppliersInvoiceDate: orderData.suppliersInvoiceDate,
            suppliersInvoiceNumber: orderData.suppliersInvoiceNumber,
            cgst: orderData.cgst,
            sgst: orderData.sgst,
            igst: orderData.igst,
            amountInWords: orderData.amountInWords,
            exportAndDispatchDetails: orderData.exportAndDispatchDetails,
            signatureId: orderData.signatureId
        };

        orderData.products.forEach(item => {
            order.items.push({
                id: item.id,
                name: item.product,
                discountInPercent: item.discountInPercent,
                discountInRupees: item.discountInRupees,
                qty: item.quantity,
                price: item.pricePerUnit,
                taxId: item.gstSlabId,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
                hsnCode: item.hsnCode,
                batchName: item.batchName,
                mfgDate: item.mfgDate,
                expDate: item.expDate,
                warehouseName: item.warehouseName,
                type: Constants.Item,

                unit: item.unit,
                taxName: '',
                taxPercent: 0,
            });
        });

        orderData.ledgers.forEach(item => {
            order.ledgers.push({
                id: item.id,
                name: item.product,
                discountInPercent: item.discountInPercent,
                discountInRupees: item.discountInRupees,
                qty: item.quantity,
                price: item.pricePerUnit,
                taxId: item.gstSlabId,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
                hsnCode: item.hsnCode,
                batchName: item.batchName,
                mfgDate: item.mfgDate,
                expDate: item.expDate,
                warehouseName: item.warehouseName,
                type: Constants.Expense,

                unit: item.unit,
                taxName: '',
                taxPercent: 0,
            });
        });
        return order;
    }

    static MapToApiModel(orderData: SalePurchase): SalePurchaseApiModel {
        let order: SalePurchaseApiModel = {
            id: orderData.id,
            partyName: orderData.partyName,
            orderDate: orderData.orderDate,
            phone: orderData.phone,
            orderNumber: orderData.orderNumber,
            reference: orderData.refNumber,
            terms: orderData.terms,
            amount: orderData.totalAmountWithRoundOff,
            stateId: orderData.billingStateId,
            paidAmount: orderData.advanceAmount,
            hasTax: orderData.hasTax,
            billingAddress: orderData.billingAddress,
            billingPincode: orderData.billingPincode,
            billingStateId: orderData.billingStateId,
            shippingAddress: orderData.shippingAddress,
            shippingPincode: orderData.shippingPincode,
            shippingStateId: orderData.shippingStateId,
            hasRoundedOff: orderData.hasRoundOff,
            roundOffAmount: orderData.roundOff,
            discountInRupees: orderData.totalDiscount,
            taxAmount: orderData.totalTax,
            notes: orderData.description,
            orderPrefix: orderData.orderPrefix,
            orderSuffix: orderData.orderSuffix,
            referenceId: orderData.referenceId,
            paymentTypeId: orderData.paymentTypeId,
            paymentMode: orderData.paymentMode,
            paymentDate: orderData.paymentDate,
            paymentReference: orderData.paymentReference,
            products: [],
            ledgers: [],

            customerName: orderData.customerName,
            dueDate: orderData.dueDate,
            suppliersInvoiceDate: orderData.suppliersInvoiceDate,
            suppliersInvoiceNumber: orderData.suppliersInvoiceNumber,
            cgst: orderData.cgst,
            sgst: orderData.sgst,
            igst: orderData.igst,
            amountInWords: orderData.amountInWords,
            exportAndDispatchDetails: orderData.exportAndDispatchDetails,
            signatureId: orderData.signatureId
        };

        orderData.items.forEach(item => {
            order.products?.push({
                id: item.id,
                product: item.name,
                discountInPercent: item.discountInPercent,
                discountInRupees: item.discountInRupees,
                quantity: item.qty,
                pricePerUnit: item.price,
                gstSlabId: item.taxId,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
                hsnCode: item.hsnCode,
                unit: item.unit,
                batchName: item.batchName,
                mfgDate: item.mfgDate,
                expDate: item.expDate,
                warehouseName: item.warehouseName,
            });
        });

        orderData.ledgers.forEach(item => {
            order.ledgers?.push({
                id: item.id,
                product: item.name,
                discountInPercent: item.discountInPercent,
                discountInRupees: item.discountInRupees,
                quantity: item.qty,
                pricePerUnit: item.price,
                gstSlabId: item.taxId,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
                hsnCode: item.hsnCode,
                unit: item.unit,
                batchName: item.batchName,
                mfgDate: item.mfgDate,
                expDate: item.expDate,
                warehouseName: item.warehouseName,
            });
        });
        return order;
    }

    static convertNumberToWords(number: number): string {
        if (number === 0) {
            return 'zero';
        }

        const words: string[] = [];

        // Handle crores
        const crores: number = Math.floor(number / 10000000);
        if (crores > 0) {
            words.push(`${this.convertNumberToWords(crores)} Crore`);
            number %= 10000000;
        }

        // Handle lakhs
        const lakhs: number = Math.floor(number / 100000);
        if (lakhs > 0) {
            words.push(`${this.convertNumberToWords(lakhs)} Lakh`);
            number %= 100000;
        }

        // Handle thousands
        const thousands: number = Math.floor(number / 1000);
        if (thousands > 0) {
            words.push(`${this.convertNumberToWords(thousands)} Thousand`);
            number %= 1000;
        }

        // Handle hundreds
        const hundreds: number = Math.floor(number / 100);
        if (hundreds > 0) {
            words.push(`${this.ones[hundreds]} Hundred`);
            number %= 100;
        }

        // Handle tens and ones
        if (number > 0) {
            if (words.length > 0) {
                words.push('and');
            }

            if (number >= 11 && number <= 19) {
                words.push(this.teens[number - 11]);
            } else {
                words.push(this.tens[Math.floor(number / 10)]);
                words.push(this.ones[number % 10]);
            }
        }

        return words.join(' ');
    }

    static numberToWords(decimalNumberStr: string): string {
        const [integerPart, decimalPart] = decimalNumberStr.split('.');
        const integerWords: string = this.convertNumberToWords(parseInt(integerPart, 10));

        let result: string = `${integerWords} Rupees`;

        if (decimalPart) {
            const decimalWords: string = this.convertNumberToWords(parseInt(decimalPart, 10));
            result += ` and ${decimalWords} Paise`;
        }

        return result;
    }

    static isLicenseValid(dateInMs: number): boolean {
        let todaysDate = new Date();
        return todaysDate.getTime() < dateInMs;
    }
}