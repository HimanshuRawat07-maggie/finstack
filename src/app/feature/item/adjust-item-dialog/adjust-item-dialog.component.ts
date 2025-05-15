import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdjustItem, GetProductById, Item, ProductDestination } from 'src/app/core/api-models/item-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-adjust-item-dialog',
  templateUrl: './adjust-item-dialog.component.html',
  styleUrls: ['./adjust-item-dialog.component.scss']
})
export class AdjustItemDialogComponent implements OnInit {
  isReduceStockEnable = false;
  batches: Array<AdjustItem> = [];
  productId: number = NaN;
  item: GetProductById = {}
  productDestinations: Array<ProductDestination> = [];
  selectedDestination: string;
  totalQty: number = 0;
  isBatchEnabled = false;
  isWarehouseEnabled = false;
  showTable = false;
  isadjustItemFormVisible = true;
  items: Array<Item> = [];
   minDate: string = '';

  @ViewChild('adjustItemForm') adjustItemForm?: any;
  @Output() confirmed = new EventEmitter<boolean>();
  constructor(public dialogRef: MatDialogRef<AdjustItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private datePipe: DatePipe, private warehouseService: WarehouseService, private itemService: ItemService,
    private itemGroupService: ItemGroupService, private toastr: ToastrService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    this.productId = this.data.id;

    const item = this.itemService.getAllItems().subscribe(res => {
      this.items = res.data;
      item.unsubscribe
    })
    const sub = this.itemService.getAllStorageCategory().subscribe(res => {
      if (res.data.length > 0) {
        res.data.forEach(x => {
          this.productDestinations.push({
            name: x,
            isWarehouse: false
          });
        });
      }
      const subs = this.warehouseService.getAllWarehouses().subscribe(warehouse => {
        let warehouses = warehouse.data;
        warehouses = warehouses.filter(x => x.name != 'DEFAULT');
        if (warehouses.length > 0) {
          warehouses.forEach(x => {
            this.productDestinations.push({
              name: x.name,
              isWarehouse: true
            });
          });
        }
        subs.unsubscribe();
        sub.unsubscribe();
      });
    });
    this.loadTabledata();
  }

  loadTabledata() {
    this.item = {}
    this.selectedDestination = '';
    this.totalQty = 0;
    this.batches = [];
    const hub = this.itemGroupService.getProductById(this.productId).subscribe(res => {
      this.item = res.data;
      if (this.item.productBatch && this.item.productBatch.length === 1 &&
        this.item.productBatch[0].batchName === 'DEFAULT' && this.item.productBatch[0].warehouseName === 'DEFAULT') {
        this.showTable = false;
        this.batches.push({
          productStockType: 'REDUCE_ADJUSTMENT',
          productId: this.productId,
          asOfDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
          batchName: this.item.productBatch[0].batchName,
          mfgDate: this.item.productBatch[0].mfgDate,
          expDate: this.item.productBatch[0].expDate,
          purchasePrice: this.item.productBatch[0].purchasePrice?.toString() ?? '',
          sellingPrice: this.item.productBatch[0].sellingPrice?.toString() ?? '',
          currentQty: this.item.productBatch[0].availableQuantity?.toString() ?? '',
          sourceWarehouseName: this.item.productBatch[0].batchName,
        });
      } else {
        this.showTable = true;
        this.item.productBatch.forEach(batch => {
          this.batches.push({
            productStockType: 'REDUCE_ADJUSTMENT',
            productId: this.productId,
            asOfDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
            batchName: batch.batchName,
            mfgDate: batch.mfgDate,
            expDate: batch.expDate,
            purchasePrice: batch.purchasePrice?.toString() ?? '',
            sellingPrice: batch.sellingPrice?.toString() ?? '',
            currentQty: batch.availableQuantity?.toString() ?? '',
            sourceWarehouseName: batch.warehouseName,
          });
        });
      }

      hub.unsubscribe();
    });
  }

  submitAddStock() {
    if (this.isadjustItemFormVisible) {
      this.adjustItemForm.control.markAllAsTouched();
    }
    if (!this.adjustItemForm.form.valid)
      return;
    for (let i = 1; i < this.batches.length; i++) {
      this.batches[i].destinationWarehouseName = this.batches[0].destinationWarehouseName;
      this.batches[i].productStorageCategory = this.batches[0].productStorageCategory;
      this.batches[i].asOfDate = this.batches[0].asOfDate;
      this.batches[i].productId = this.batches[0].productId;
      this.batches[i].details = this.batches[0].details;
      this.batches[i].pricePerUnit = this.batches[0].pricePerUnit;
      this.batches[i].productStockType = this.batches[0].productStockType;
    }

    const sub = this.itemService.updateAdjustItem(this.batches.filter(x => x.quantity > 0)).subscribe(res => {
      if (res.code == 200) {
        this.dialogRef.close();
        this.confirmed.emit(true);
      } else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }

  onDestinationChange() {
    let isWarehouse = this.productDestinations?.find(x => x.name === this.selectedDestination)?.isWarehouse ?? false;
    if (isWarehouse) {
      this.batches.forEach(batch => {
        batch.destinationWarehouseName = this.selectedDestination;
        batch.productStorageCategory = null;
      });
    } else {
      this.batches.forEach(batch => {
        batch.destinationWarehouseName = null;
        batch.productStorageCategory = this.selectedDestination;
      });
    }
  }

  updateTotalQty() {
    this.totalQty = 0;
    console.log(this.batches);

    this.batches.forEach(batch => {
      if (batch.quantity > 0)
        this.totalQty += batch.quantity;
    });
  }
}
