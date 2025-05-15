export interface Warehouse {
    id?: number;
    name?: string;
    address?: string;
    items?: number;
    products?: Array<WarehouseProduct>
    isMenuVisible?: boolean;
}

export interface WarehouseProduct {
    productName?: string;
    batchName?: string;
    mfgDate?: string;
    expDate?: string;
    quantity: number;
    sellingPrice?: number;
    purchasePrice?: number;
}