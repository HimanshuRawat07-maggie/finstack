export interface Item {
    id?: number;
    name?: string;
    sellingPrice?: number;
    sellingPriceWithTax?: number;
    purchasePrice?: number;
    stockValue?: number;
    purchasePriceWithTax?: number;
    hsnCode?: string;
    image?: string;
    barCode?: string;
    productGroup?: string;
    company?: string;
    unit?: string;
    availableQuantity?: number;
    reservedQuantity?: number;
    totalQuantity?: number;
    type?: string;
    gstSlab?: GstSlab;
    isMenuVisible?: boolean;
    quantity?: number;
    manufacturedProduct?: boolean;
    pricePerUnit?: number;
}

export interface ItemWithDetails {
    isbarCode?: boolean;
    id?: number
    name?: string
    code?: string
    alias?: string
    productBatch?: ProductBatch[]
    type?: string
    hsnCode?: string
    description?:string
    image?: string
    productGroup?: string
    unitId?: number
    unit?: string
    taxId?: number
    discount?: number
    quantity?: number
    numberOfBatches?: number
    expenseCategoryName?: string
    // manufacture: Manufacture[]
    sellingPrice?: number
    purchasePrice?: number
    labourCost?: number
    electricityCost?: number
    logisticsCost?: number
    packagingCharge?: number
    otherCharge?: number
    amount?: number
    discountInPercentage?: boolean
    manufacturedProduct?: boolean
    stockValue?: number
}

export interface ItemPrintDetails{
    productBatchId?: number;
    barcodeCount?: number;
}

export interface ManufactureAdjustItem {
    id?: number;
    productId?: number;
    asOfDate?: string;
    pricePerUnit?: number;
    details?: string;
    productStockType?: string;
    productStorageCategory?: string;
    quantity?: number;
    batchName?: string;
    sourceWarehouseName?: string;
    destinationWarehouseName?: string;
    byProducts?: ByProduct[];
    products?: ManufactureAdjustItem[];
    sourceProductId?: number;
    packagingCost?: number;
    electricityCost?: number;
    labourCost?: number;
    logisticsCost?: number;
    otherCost?: number;
    labourChargesDescription?: string,
    electricityChargesDescription?: string,
    packagingChargesDescription?: string,
    otherChargesDescription?: string,
    logisticsChargesDescription?: string;
}

export interface ByProduct {
  productName?: string
  quantity?: number
  atPrice?: number
  batchName?: string
  warehouseName?: string
}


export interface SaveProductStock {
    id?: number;
    asOfDate?: string;
    pricePerUnit?: number;
    productStockType?: string;
    quantity?: number;
    productId?: number;
}

export interface Unit {
    id?: number;
    fullName?: string;
    shortName?: string;
}

export interface ProductGroup {
    id: number;
    productGroupName?: string;
}

export interface GstSlab {
    id?: number;
    name?: string;
    valueInPercent?: number;
}

export interface SaveProductOrService {
    productRequestDto?: ProductRequestDto;
    productStockRequestDto?: ProductStockRequestDto;
}

export interface ProductRequestDto {
    id?: number;
    name?: string;
    sellingPrice?: number;
    sellingPriceWithTax?: number;
    purchasePrice?: number;
    purchasePriceWithTax?: number;
    gstSlabId?: number;
    type?: string;
    hsnCode?: string;
    image?: string;
    barCode?: string;
    productGroup?: string;
    company?: number;
    unit?: string;
}

export interface ProductStockRequestDto {
    id?: number;
    asOfDate?: string | null;
    pricePerUnit?: number | null;
    productStockType?: string;
    quantity?: number | null;
    productId?: number;
}

export interface ProductGroupName {
    id?: number;
    name?: string;
}

export interface GetProductResponse {
    id?: number;
    updatedBy?: string;
    name?: string;
    gstSlab?: GstSlab;
    gstSlabId?: number;
    sellingPrice?: number;
    sellingPriceWithTax?: number;
    purchasePrice?: number;
    purchasePriceWithTax?: number;
    type?: string;
    totalQuantity?: number;
    availableQuantity?: number;
    reservedQuantity?: number;
    hsnCode?: string;
    image?: string;
    barCode?: string;
    productGroup?: string;
    company?: string;
    unit?: string;
    productStockId?: number;
}

export interface HsnCode {
    code?: string,
    description?: string
}




export interface Product {
    id?: number;
    name?: string;
    code?: string;
    alias?: string;
    taxId?: number;
    type?: string;
    hsnCode?: string;
    image?: string;
    productGroup?: string;
    unit?: string;
    discount?: number;
    discountInPercentage?: boolean;
    productBatch?: Array<ProductBatch>;
    expenseProduct?: boolean;
    openingQty?: number;
    manufacturedProduct?: boolean;
    manufacture?: Manufacturing[];
    labourCost?: number;
    electricityCost?: number;
    logisticsCost?: number
    packagingCost?: number;
    otherCost?: number;
    createdByName?: string;
    updatedByName?: string;
    description?: string;
    pricePerUnit?: number;
    productStockType?: string;
    productStorageCategory?: string
    destinationWarehouseName?:string
    quantity?: number;
    companyWarehouseProductBatchId?:number
    details?: string;
    productName?: string;
    partyName?: string;
    orderDate?: string;
    billNumber?: string;
    paymentStatus?: string;
    transactionType?: string;
    asOfDate?: string;
    reservedQuantity?: number;
    orderPrefix?: string;
    orderSuffix?: string;
    paymentType?: string;
    amount?: number;
    labourChargesDescription?: string
    electricityChargesDescription?: string,
    packagingChargesDescription?: string,
    otherChargesDescription?: string,
    logisticsChargesDescription?: string;
}

export interface Manufacturing {
    productId?: any;
    id?: number;
    name?: string;
    productName?:string
    unit?: string;
    quantity?: number;
    pricePerUnit?: number;
    batchesAndWarehouseDetails?: Array<ProductBatch>;
    batches?: Array<string>
    warehouses?: Array<string>
    batchName?: string;
    sourceWarehouseName?: string;
    warehouseName?: string
}

export interface ProductBatch {
    barCodeCount?:number
    batchName?: string;
    sellingPrice?: number;
    purchasePrice?: number;
    quantity?: number;
    barcode?: string;
    asOfDate?: string;
    warehouseName?: string;
    sellingPriceHasTax?: boolean;
    purchasePriceHasTax?: boolean;
    atPrice?: number;
    availableQuantity?: number;
    reservedQuantity?: number;
    stockValue?: number;
    mfgDate?: string;
    expDate?: string;
    companyWarehouseProductBatchId?: number;
    companyPartyTransactionProductId?: number;
    batchId?: number;

    selectedQuantity?: number;
    isEditable?: boolean;
}

export interface AdjustItem {
    id?: number;
    productId?: number;
    asOfDate?: string;
    pricePerUnit?: number;
    details?: string;
    productStockType?: string;
    productStorageCategory?: string;
    quantity?: number;
    batchName?: string;
    barcode?: string;
    sourceWarehouseName?: string;
    availableQuantity?: number
    destinationWarehouseName?: string;
    companyWarehouseProductBatchId?: number;
    mfgDate?: string;
    expDate?: string;
    sellingPrice?: string;
    purchasePrice?: string;
    currentQty?: string;
}


export interface GetProductById {
    id?: number;
    createdOn?: string;
    createdBy?: string;
    name?: string;
    productBatch?: ProductBatch[];
    type?: string;
    hsnCode?: string;
    image?: string;
    productGroup?: string;
    unitId?: number;
    taxId?: number;
    discount?: number;
    quantity?: number;
    numberOfBatches?: number;
    discountInPercentage?: boolean;
}

export interface ProductDestination {
    name: string;
    isWarehouse: boolean;
}

export interface AddAdditionalCost{
    charge?: string;
    chargesArray?: Array<string>;
    amount?: number;
    description?: string;
}


export interface GetManufactureById {
  id?: number;
  productId?: number;
  productName?: string;
  unit?: string;
  asOfDate?: string;
  pricePerUnit?: number;
  details?: string;
  productStockType?: string;
  productStorageCategory?: string;
  quantity?: number;
  batchName?: string;
  sourceWarehouseName?: string;
  destinationWarehouseName?: string;
  byProducts?: ByProduct[];
  products?: string[];
  companyWarehouseProductBatchId?: number;
  sourceProductId?: number;
  labourCost?: number;
  electricityCost?: number;
  packagingCost?: number;
  logisticsCost?: number;
  otherCost?: number;
  labourChargesDescription?: string;
  electricityChargesDescription?: string;
  packagingChargesDescription?: string;
  otherChargesDescription?: string;
  logisticsChargesDescription?: string;
}

export interface ByProduct {
    id?: number;
    productId?: number;
  productName?: string;
  quantity?: number;
  atPrice?: number;
  batchName?: string;
  warehouseName?: string;
}