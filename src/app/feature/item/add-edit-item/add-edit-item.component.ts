import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ProductGroup, Unit, GstSlab, ProductStockRequestDto, HsnCode, Product, Item, AddAdditionalCost } from 'src/app/core/api-models/item-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AddStockBatchComponent } from '../add-stock-batch/add-stock-batch.component';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { forkJoin } from 'rxjs';
// import { BarcodeScanComponent } from '../barcode-scan/barcode-scan.component';

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.scss'],
  providers: [DatePipe]
})
export class AddEditItemComponent implements OnInit {
  isServiceEnable = false;
  units: Array<Unit> = []
  group: Array<ProductGroup> = [];
  taxSlabs: Array<GstSlab> = [];
  gstTaxSlabs: Array<GstSlab> = [];
  itemData: Product = {
    type: 'Product',
    discountInPercentage: true,
    productBatch: [{
      sellingPriceHasTax: false,
      purchasePriceHasTax: false
    }],
    manufacture: [{
      name: '',
      quantity: null,
      pricePerUnit: null
    }]
  };
  items: Array<Item> = [];
  getProductStockData: ProductStockRequestDto = {}
  isEditMode: boolean = false;
  hsnTable: Array<HsnCode> = [];
  isHsnTableVisible: boolean = false;
  // addAdditionalCost: Array<number> = [1];
  isAdditionalCostTableVisible = false;
  atPrice: number;
  asOfDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;

  isBatchEnabled = false;
  isManufacturingEnabled = false;
  isWarehouseEnabled = false;
  isDiscountEnabled = false;
  isBatchLocationTrackingEnable = false;
  disableBatchTracking = false;
  disableManufacturing = false;
  batchTrackingMsg = '';
  batchBtnTxt = '';
  isManuFactureVisible = false;
  isOpenedAsDialog: boolean = false;
  minDate: string = '';
    additionalCost: Array<AddAdditionalCost> = [
    {
      chargesArray:['Packaging Charges','Electricity Charges','Labour Charges','Logistics Charges','Other Charges']
    }
  ];
  chargeOptions:Array<string>=['Packaging Charges','Electricity Charges','Labour Charges','Logistics Charges','Other Charges']
  isAddAdditionCostButtonVisible = true;
  getItemId: number = NaN;
  transactionType: string = '';
  isOpenStockBatchOpenWithPurchase = false;
  isSubmitButtonDisable = false;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute,
    private datePipe: DatePipe, private itemService: ItemService, private itemGroupService: ItemGroupService,
    private toastr: ToastrService, private authService: AuthenticationService,private location:Location,
    @Optional() private dialogRef: MatDialogRef<AddEditItemComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
    if (this.dialogRef && this.data) {
      this.isOpenedAsDialog = true;
      if (this.data.itemName) {
        this.itemData.name = this.data.itemName;  
      }
      if (data.type) {
        this.transactionType = data.type
      }
    }
  }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    this.isManufacturingEnabled = this.authService.isManufacturnigEnabled == 'true';
    this.isDiscountEnabled = this.authService.isDiscountEnabled == 'true';

    if (this.isBatchEnabled && this.isWarehouseEnabled) {
      this.batchTrackingMsg = 'Enable Batch or Warehouse tracking for this product';
      this.batchBtnTxt = 'Batch';
    } else if (this.isBatchEnabled && !this.isWarehouseEnabled) {
      this.batchTrackingMsg = 'Enable Batch tracking for this product';
      this.batchBtnTxt = 'Batch';
    } else if (!this.isBatchEnabled && this.isWarehouseEnabled) {
      this.batchTrackingMsg = 'Enable Warehouse tracking for this product';
      this.batchBtnTxt = 'Warehouse';
    }

    const sub = forkJoin({
      slabs: this.itemService.getAllSlab(),
      groups: this.itemGroupService.getAllGroup(),
      units: this.itemService.getAllUnit()
    }).subscribe(({ slabs, groups, units }) => {
      this.taxSlabs = slabs.data;
      this.gstTaxSlabs = this.taxSlabs.filter((str) => str.name.startsWith('G') || str.name.startsWith('E') || str.name.startsWith('N'));

      this.group = groups.data;
      this.units = units.data;
      this.group = this.group.filter(x => x.id > 0);

      this.route.paramMap.subscribe(parameterMap => {
        let id = parameterMap.get('id');
        this.getItemId = parseInt(id, 10);
        if (id != null) {
          this.isEditMode = true;
          this.itemGroupService.getProductByInitialId(parseInt(id, 10)).subscribe(res => {
            this.itemData = res.data;
            if (this.itemData.manufacturedProduct == false || this.itemData.manufacture.length == 0) {
              this.itemData.manufacture = [{
                name: '',
                quantity: null,
                pricePerUnit: null
              }]
            }
            else {
              this.disableManufacturing = true;
            }
            if (this.itemData.manufacture.length != 0 && this.itemData.manufacturedProduct) {
              this.isManuFactureVisible = true;
            }
            if (this.itemData.type == 'Service') {
              this.isServiceEnable = true;
            }

            if (this.itemData.productBatch && this.itemData.productBatch.length === 1 &&
              this.itemData.productBatch[0].batchName === 'DEFAULT' && this.itemData.productBatch[0].warehouseName === 'DEFAULT') {
              this.isBatchLocationTrackingEnable = false;
            } else {
              this.disableBatchTracking = true;
              this.isBatchLocationTrackingEnable = true;
            }
            this.calcOpeningQtyFromBatch();
            this.atPrice = this.itemData.productBatch[0].atPrice;
            this.asOfDate = this.itemData.productBatch[0].asOfDate;

            this.additionalCost = [];
            if (this.itemData.packagingCost != 0) {
              this.additionalCost.push({
                charge: 'Packaging Charges', amount: this.itemData.packagingCost
              })
            }
            if (this.itemData.electricityCost != 0) {
              this.additionalCost.push({
                charge: 'Electricity Charges', amount: this.itemData.electricityCost
              })
            }
            if (this.itemData.labourCost != 0) {
              this.additionalCost.push({
                charge: 'Labour Charges', amount: this.itemData.labourCost
              })
            }
            if (this.itemData.logisticsCost != 0) {
              this.additionalCost.push({
                charge: 'Logistics Charges', amount: this.itemData.logisticsCost
              })
            }
            if (this.itemData.otherCost != 0) {
              this.additionalCost.push({
                charge: 'Other Charges', amount: this.itemData.otherCost
              })
            }
          });
        }
      });
      if (sub)
        sub.unsubscribe();
    });
    const item = this.itemService.getAllItems().subscribe(res => {
      this.items = res.data;
      this.items = this.items.filter(obj => obj.type !== "Service");
      if (this.getItemId) {
         this.items = this.items.filter(obj => obj.id !== this.getItemId);
      }
      item.unsubscribe();
    });
  }

  toggleGoodAndService() {
    this.isServiceEnable = !this.isServiceEnable;
    this.itemData.type = this.isServiceEnable ? 'Service' : 'Product';
    if (this.isServiceEnable) {
      this.isBatchLocationTrackingEnable = false;
      this.itemData.productBatch = [{
        sellingPriceHasTax: false,
        purchasePriceHasTax: false
      }];
    }
  }


  assignCode() {
     this.itemService.assignCode().subscribe(res => {
      this.itemData.productBatch[0].barcode = res.data;
    });
  }

  checkBarcode() {
    const sub = this.itemService.getProductByBarcode(this.itemData.productBatch[0].barcode).subscribe(res => {
      if (res.code == 200) {
        this.toastr.error('Product with this barcode is already exist');
        this.itemData.productBatch[0].barcode = null;
      }
    })
  }

  openModal() {
    let dialogRef = this.dialog.open(AddCategoryModalComponent, { width: '30%' });
    dialogRef.afterClosed().subscribe(res => {
      this.itemGroupService.getAllGroup().subscribe(groupRes => {
        this.group = groupRes.data;
        this.group = this.group.filter(x => x.id > 0);
        this.itemData.productGroup = res.name;
      });
    });
  }

  onSubmit(redirectToItemDashboard: boolean) {
    this.itemData.manufacture = this.itemData.manufacture.filter(row => row.name != '');
    if (this.itemData.manufacture.length != 0) {
      this.itemData.manufacturedProduct = true;
    }
    if (this.isBatchLocationTrackingEnable && this.itemData.productBatch.length > 0) {
      this.itemData.productBatch.forEach(batch => {
        batch.atPrice = this.atPrice;
        batch.asOfDate = this.asOfDate;
      });
    } else {
      if (this.itemData?.productBatch[0]) {
        this.itemData.productBatch[0].atPrice = this.atPrice;
        this.itemData.productBatch[0].asOfDate = this.asOfDate;
        this.itemData.productBatch[0].quantity = this.itemData.openingQty;
      }
    }
     if (this.transactionType == 'purchase' && this.isOpenStockBatchOpenWithPurchase && this.isOpenedAsDialog) {
          this.itemData.productBatch[0].batchName = 'Batch-1';
        }
    if (this.itemData.id == null) {
      this.itemGroupService.saveProductOrService(this.itemData).subscribe(res => {
        if (res.code == 200) {
          this.toastr.success(res.message);
          if (this.isOpenedAsDialog) {
            this.dialogRef.close(res.data);
          } else {
            if (redirectToItemDashboard) {
              if (this.isManuFactureVisible) {
                this.router.navigateByUrl('/app/item/manufacturing');
              } else {
                this.router.navigateByUrl('/app/item/dashboard');
              }
            } else {
              const item = this.itemService.getAllItems().subscribe(res => {
                this.items = res.data;
                this.items = this.items.filter(obj => obj.type !== "Service");
                item.unsubscribe();
              });
              this.itemData = {
                type: 'Product',
                discountInPercentage: true,
                productBatch: [{
                  sellingPriceHasTax: false,
                  purchasePriceHasTax: false
                }],
                manufacture: [{
                  name: '',
                  quantity: null,
                  pricePerUnit: null
                }],
                asOfDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
              };
              this.atPrice = 0;
              this.isServiceEnable = false;
              this.isManuFactureVisible = false;
              this.additionalCost = [{}];
            }
          }
        } else {
          this.toastr.error(res.message);
        }
        this.isSubmitButtonDisable = false;
      });
    } else {
      this.itemGroupService.updateProduct(this.itemData).subscribe(res => {
        if (res.code == 200) {
             if (this.isManuFactureVisible) {
               this.router.navigateByUrl('/app/item/manufacturing');
              } else {
                this.router.navigateByUrl('/app/item/dashboard');
              }
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
        this.isSubmitButtonDisable = false;
      });
    }
  }

  getHsnCode() {
    if (this.itemData?.hsnCode?.length >= 3) {
      const sub = this.itemService.getHsnCode(this.itemData.hsnCode!).subscribe(res => {
        if (res.code == 200) {
          this.hsnTable = res.data;
          this.isHsnTableVisible = true;
        }
        sub.unsubscribe();
      });
    }
  }

  setHsnCode(item: HsnCode) {
    this.itemData.hsnCode = item.code;
    this.isHsnTableVisible = false;
  }

  openAddStockBatch() {
    if (this.transactionType == 'purchase') {
      this.isOpenStockBatchOpenWithPurchase=!this.isOpenStockBatchOpenWithPurchase
    }
    if (this.isBatchLocationTrackingEnable && !this.isOpenedAsDialog) {
    // if (this.isBatchLocationTrackingEnable) {
      let dialogRef = this.dialog.open(AddStockBatchComponent, {
        width: '95%',
        height: '85%',
        data: this.itemData.productBatch
      });
      // dialogRef.afterClosed().subscribe(res => {
      //   if (res && res.length > 0) {
      //     this.itemData.productBatch = res;
      //     this.calcOpeningQtyFromBatch();
      //   }
      // });
      dialogRef.componentInstance.confirmed.subscribe(res => {
        if (res && res.length > 0) {          
          this.itemData.productBatch = res;
          this.calcOpeningQtyFromBatch();
        }
      })
    }

  }

  addAdditionalCost() {    
    this.additionalCost.push({
      chargesArray:[]
    });
      if (this.additionalCost.length == 5) {
      this.isAddAdditionCostButtonVisible = false;
    }
  }

  calcOpeningQtyFromBatch() {
    let qty = 0;
    this.itemData.productBatch?.forEach(batch => { qty += batch.quantity ?? 0; });
    this.itemData.openingQty = qty;
  }

  addMaterial() {
    this.itemData.manufacture.push({
      name: '',
      quantity: null,
      pricePerUnit: null
    })
  }


  toggleAdditionalTable() {
    this.isAdditionalCostTableVisible = true;
  }

  getTotalEstimatedCostOfManufacturing(): number {
    if (this.itemData.manufacture) {
      return this.itemData.manufacture.reduce((total, manufactureAmt) => {
        return (manufactureAmt.quantity || 0) * (manufactureAmt.pricePerUnit || 0) + total;
      }, 0);
    }
    else {
      return 0;
    }
  }

  getTotalAdditionalCost(): number {
    let amount = 0;
    this.additionalCost.forEach(x => {
      amount = x.amount + amount;
    });
    return amount ? amount : 0;
  }


  calculateTotal() {
    this.data.packagingCharge = 0;
    this.data.electricityCost = 0;
    this.data.labourCost = 0;
    this.data.logisticsCost = 0;
    this.data.otherCharge = 0;

    this.additionalCost.forEach(row => {
      switch (row.charge) {
        case 'Packaging Charges':
          this.data.packagingCharge += row.amount;
          break;
        case 'Electricity Charges':
          this.data.electricityCost += row.amount;
          break;
        case 'Labour Charges':
          this.data.labourCost += row.amount;
          break;
        case 'Logistics Charges':
          this.data.logisticsCost += row.amount;
          break;
        case 'Other Charges':
          this.data.otherCharge += row.amount;
          break;
      }
    });
  }

  getManufacturedItemUnit(name: string, idx: number): string {
    let item = this.items.find(x => x.name == name);
    // if (item.purchasePrice) {
    //   this.data.manufacture[idx].pricePerUnit = item.purchasePrice;
    // }
    // else {
    //   this.data.manufacture[idx].pricePerUnit = null;
    // }
    if (item?.unit) {
      return item.unit;
    }
    else {
      return '';
    }
  }

  getManufacturedItemPurchasePrice(name: string, idx: number) {
    let item = this.items.find(x => x.name == name);
    if (item.purchasePrice != null) {
      this.itemData.manufacture[idx].pricePerUnit = item.purchasePrice;
      return item.purchasePrice;
    }
    else {
      return 0;
    }
  }

  removeRow(idx: number) {
    this.itemData.manufacture.splice(idx, 1);
  }

  itemNameAvailablity() {
    if (this.itemData.name != null) {
      const sub = this.itemService.checkItemNameAvailablity(this.itemData.name).subscribe(res => {
        if (res.code != 200) {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      })
    }
  }

  itemAliasAvailablity() {
    if (this.itemData.alias != null) {
      const sub = this.itemService.checkItemAliasAvailablity(this.itemData.alias).subscribe(res => {
        if (res.code != 200) {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      })
    }
  }

  close() {
    if (this.isOpenedAsDialog) {
      this.dialogRef.close();
    }else{
       this.router.navigateByUrl('/app/item/dashboard')
    } 
  }

  removeAdditionalCost(idx:number) {
    this.additionalCost.splice(idx, 1);    
    if (this.additionalCost.length < 5) {
      this.isAddAdditionCostButtonVisible = true;
    }
  }

   getOptions(idx: number): Array<string> {
    this.itemData.packagingCost = 0;
    this.itemData.electricityCost = 0;
    this.itemData.labourCost = 0;
    this.itemData.logisticsCost = 0;
    this.itemData.otherCost = 0;
     this.additionalCost.forEach(row => {
      switch (row.charge) {
        case 'Packaging Charges':
          this.itemData.packagingCost += row.amount;
          break;
        case 'Electricity Charges':
          this.itemData.electricityCost += row.amount;
          break;
        case 'Labour Charges':
          this.itemData.labourCost += row.amount;
          break;
        case 'Logistics Charges':
          this.itemData.logisticsCost += row.amount;
          break;
        case 'Other Charges':
          this.itemData.otherCost += row.amount;
          break;
      }
    });
    let selectedCharges = this.additionalCost?.map(x => x.charge) ?? [];
    return ['Select',...this.chargeOptions.filter(x => !selectedCharges.includes(x) ||
      (this.additionalCost[idx]?.charge && x == this.additionalCost[idx].charge))];
    
  }

}

