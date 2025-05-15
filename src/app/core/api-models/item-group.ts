export interface GetProductGroup {
    id?: number;
    productGroupName?: string;
    productCount?: number;
    isMenuVisible?: boolean;
}

export interface GetItemByGroupId {
    productId: number
    createdOn: string
    createdBy: string
    productName: string
    sellingPrice: number
    purchasePrice: number
    purchasePriceWithTax: number
    sellingPriceWithTax: number
    type: string
    totalQuantity: number
    availableQuantity: number;
    reservedQuantity: number
    hsnCode: string
    image: string
    barCode: string
    productGroup: string
    unit: string
    gstSlab: GstSlab
    discountInPercent: number
    discountInRupees: number
}

export interface updatePriceListDto {
  productDetailRequestDtos?: ProductDetailRequestDto[]
  salePrice?: boolean
  purchasePrice?: boolean
  value?: number
  increaseEnable?: boolean
  amountEnable?: boolean
}

export interface ProductDetailRequestDto {
  productName?: string
  batchName?: string
  warehouseName?: string
}

export interface PriceList{
    productName: string;
    warehouseName: string;
    batchName: string;
}

export interface GstSlab {
    id: number
    name: string
    valueInPercent: number
}