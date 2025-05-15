import { TokenType } from '@angular/compiler';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { add } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import { ProductBatch } from 'src/app/core/api-models/item-model';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-sale-purchase-batch-model',
  templateUrl: './sale-purchase-batch-model.component.html',
  styleUrls: ['./sale-purchase-batch-model.component.scss']
})
export class SalePurchaseBatchModelComponent {
  warehouses: Array<Warehouse> = [];
  isBatchEnabled = false;
  isWarehouseEnabled = false;
  minDate: string = '';
  length: number = 0;
  name: any
  isPurchaseFirstBatch= false;

  @ViewChild('tableContainer') tableContainer!: ElementRef;
constructor(public dialogRef: MatDialogRef<SalePurchaseBatchModelComponent>,private itemService:ItemService,private toastr:ToastrService,
    private warehouseService: WarehouseService, private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      batches: Array<ProductBatch>,
      showAddBatchBtn: boolean,
      type:string
  }) {

  this.data.batches.forEach(x => x.isEditable = false);
  this.length = data.batches.length;
  const sub = this.warehouseService.getAllWarehouses().subscribe(res => {
    this.warehouses = res.data;
    this.warehouses.sort((a, b) => {
      if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
      if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; };
      return 0;
    });
    if (this.data.showAddBatchBtn) {
      if (data.type == 'purchase') {
        this.isPurchaseFirstBatch = true;
      }
      this.addBatch();
    }
    sub.unsubscribe();
  });
  }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
  }

  addBatch() {  
    this.warehouseService.processing(true);
    let warehouse;
    for (let i = 0; i < this.warehouses.length; i++){
      if (this.warehouses[i].name != 'DEFAULT') {
        warehouse = this.warehouses[i].name;
        break;
      }      
    }
    if (warehouse == undefined || warehouse == null || warehouse.length == 0) {
      warehouse = this.warehouses[0].name;
    }

    do {
      this.name = Math.floor(100000 + Math.random() * 900000);
    } while (this.checkName(this.name));
    
    if (this.data.type != 'purchase' || !this.isPurchaseFirstBatch) { 
      if (this.data.batches[this.data.batches.length - 1].selectedQuantity == 0 && this.data.batches[this.data.batches.length - 1].barcode) {
        this.data.batches[this.data.batches.length - 1].selectedQuantity = 1;
      }
      this.data.batches.push({
        batchName: `${this.name}`,
        mfgDate: this.data.batches[this.data.batches.length - 1].mfgDate,
        expDate: this.data.batches[this.data.batches.length - 1].expDate,
        purchasePrice: this.data.batches[this.data.batches.length - 1].purchasePrice,
        sellingPrice: this.data.batches[this.data.batches.length - 1].sellingPrice,
        warehouseName: warehouse,
        selectedQuantity: 0,
        isEditable: true,
      });
      this.scrollToBottom();
    } else {
      this.isPurchaseFirstBatch = false;
      this.data.batches.push({
        isEditable: true,
        selectedQuantity: 0,
        batchName: `${this.name}`,
        warehouseName:warehouse
      });
    }
    this.warehouseService.processing(false);
  }

  checkName(name: string) {
    let array = this.data.batches.filter(x => x.batchName === name)
    if (array.length> 0) {
      return true
    } else {
      return false;
    }
  }
  scrollToBottom(): void {
    const element = this.tableContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  checkBarcode(idx: number, e: any) {  
    if (e.key == 'Enter') {
      let lastIndex = (this.data.batches.length - 1);
    if (this.data.batches[this.data.batches.length - 1].selectedQuantity == 0) {
      this.data.batches[this.data.batches.length - 1].selectedQuantity = 1;
    }
    if (lastIndex == idx) {
      this.addBatch();
      setTimeout(() => {
        document.getElementById('itemname-' + (idx + 1)).focus();
      }, 50);   
    }
}
  
    // if (e) {
    //   const sub = this.itemService.getProductByBarcode(this.data.batches[idx].barcode).subscribe(res => {
    //     if (res.code == 200) {
    //       this.toastr.error('Product with this barcode is already exist');
    //       this.data.batches[idx].barcode = null;
    //     } else {
    //       if (e.key == 'Enter') {
    //         let lastIndex = (this.data.batches.length - 1);
    //         let copy = ( this.data.batches.findIndex(o => o.barcode === this.data.batches[idx].barcode) !== idx)
    //         if (copy) {
    //           this.toastr.error('You have entered this barcode already');
    //           this.data.batches[idx].barcode = null;
    //         } else {
    //           if (lastIndex == idx) {
    //             this.addBatch();
    //             setTimeout(() => {
    //               document.getElementById('itemname-' + (idx + 1)).focus();
    //             }, 50);   
    //           }
    //         }

    //       }
    //     }
    //     sub.unsubscribe();
    //   });
    // }
  }

  removeBatch(index:number) {
    this.data.batches.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    let check = false;
    // if (this.data.batches.length > this.length) {
    //   for (let i =this.length; i < this.data.batches.length; i++){
    //     if ((this.data.batches[i].batchName || this.data.batches[i].barcode) && !this.data.batches[i].selectedQuantity) {
    //       this.toastr.error('Fill the quantity of new batch');
    //       check = true;
    //       break;
    //     }
    //   }
    // }
    if (check) {
      return;
    }

    this.dialogRef.close(this.data);
  }
}
