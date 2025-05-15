import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductBatch } from 'src/app/core/api-models/item-model';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
// import { BarcodeScanComponent } from '../barcode-scan/barcode-scan.component';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-stock-batch',
  templateUrl: './add-stock-batch.component.html',
  styleUrls: ['./add-stock-batch.component.scss']
})
export class AddStockBatchComponent {
  batches: Array<ProductBatch> = [];
  warehouses: Array<Warehouse> = [];
  isBatchEnabled = false;
  isWarehouseEnabled = false;
  batchBtnTxt = '';
  minDate: string = '';

  @Output() confirmed = new EventEmitter<any>();
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  constructor(public dialogRef: MatDialogRef<AddStockBatchComponent>,private itemService:ItemService,private toastr:ToastrService,
    private warehouseService: WarehouseService, private authService: AuthenticationService, private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Array<ProductBatch>) {

    const sub = this.warehouseService.getAllWarehouses().subscribe(res => {
      this.warehouses = res.data;
      this.warehouses = this.warehouses.filter(x => x.name != 'DEFAULT');
      this.warehouses.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });

      if (data === undefined || data === null || data.length === 0 || Object.keys(data[0]).length == 2) {
        this.addBatch(true);
      } else {
        this.batches = [...data];
        if (this.batches.length == 1 && this.batches[0].batchName == 'DEFAULT') {
          this.batches[0].batchName = 'Batch-1';
        }
      }

      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';

    if (this.isBatchEnabled && this.isWarehouseEnabled) {
      this.batchBtnTxt = 'Add Batch';
    } else if (this.isBatchEnabled && !this.isWarehouseEnabled) {
      this.batchBtnTxt = 'Add Batch';
    } else if (!this.isBatchEnabled && this.isWarehouseEnabled) {
      this.batchBtnTxt = 'Add Warehouse';
    }
  }

  addBatch(isFirst?: boolean) {
    if (isFirst == true) {        
      this.batches.push({
        batchName: 'Batch-1',
        warehouseName: this.warehouses[0]?.name
      });
    } else {
      let uniqueBatches = this.batches.filter(x => x.batchName.includes("Batch-")).map(x => x.batchName);
      if (uniqueBatches.length == 0) {    
        this.batches.push({
          batchName: `Batch-${this.batches.length + 1}`,
          mfgDate: this.batches[this.batches.length - 1].mfgDate,
          expDate: this.batches[this.batches.length - 1].expDate,
          purchasePrice: this.batches[this.batches.length - 1].purchasePrice,
          sellingPrice: this.batches[this.batches.length - 1].sellingPrice,
          warehouseName: this.warehouses[0]?.name
        });
      } else {
        let uniqueBatchesNum: number[] = [];
        uniqueBatches.forEach(x => {
          const num = x.match(/\d/g);
          if (num) {
            uniqueBatchesNum.push(Number(num.join("")));
          }
        });
        uniqueBatchesNum = uniqueBatchesNum.sort((a, b) => a - b);
         this.batches.push({
          batchName: `Batch-${uniqueBatchesNum[uniqueBatchesNum.length-1]+1}`,
          mfgDate: this.batches[this.batches.length - 1].mfgDate,
          expDate: this.batches[this.batches.length - 1].expDate,
          purchasePrice: this.batches[this.batches.length - 1].purchasePrice,
          sellingPrice: this.batches[this.batches.length - 1].sellingPrice,
          warehouseName: this.warehouses[0]?.name
        });
      }
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    const element = this.tableContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  close() {
    this.dialogRef.close();
  }

  // openBarCodeModal(idx:number) {
  //     let dialogRef = this.dialog.open(BarcodeScanComponent, {
  //     width: '30%',
  //     autoFocus: false,
  //     data: {
  //       type:'item'
  //     },
  //   });

  //   dialogRef.componentInstance.confirmed.subscribe((res:any,barcode:string)=> {
  //     if (res) {
  //       this.batches[idx].barcode = res.barCode;
  //         this.batches.forEach((x, i) => {
  //         if (x.barcode == res.barCode && idx != i) {
  //           this.toastr.error('Batch with this barcode is already exist');
  //           this.batches[idx].barcode = null
  //         }
  //       });
  //     }
  //   });
  // }

  checkBarcode(i:number,barcode:string) {
    if (barcode.length>0) {
      const sub = this.itemService.getProductByBarcode(barcode).subscribe(res => {
        if (res.code == 200) {
          this.toastr.error('Product with this barcode is already exist');
          this.batches[i].barcode = null;
        } else {
          this.batches.forEach((x, idx) => {
            if (x.barcode == barcode && idx != i) {
              this.toastr.error('Batch with this barcode is already exist');
              this.batches[i].barcode = null;
            }
          });
        }
        sub.unsubscribe();
      });
    }
  }

  save() {
    let check = true
    for (let i = 0; i < this.batches.length; i++){
      if (this.batches[i].batchName == undefined || this.batches[i].batchName == null || this.batches[i].batchName.length == 0 || this.batches[i].quantity == undefined || this.batches[i].quantity == null || this.batches[i].quantity<1) {
        this.toastr.error(`Batch name can't be empty and quantity should be greater than zero`);
        check = false;
        break;
      }
    }
    if (check) {
      this.confirmed.emit(this.batches);
      this.close();
    }
  }

  removeItem(id: number) {
    if (this.batches.length > 1) {
      this.batches.splice(id, 1)
    }
  }

  assignCode() {
    this.batches.forEach(element => {
      if (element.barcode === undefined || element.barcode === null || element.barcode.length === 0) {
        element.barcode = Math.floor((Math.random() * 9000000000) + 1000000000).toString();
      }
    });
  }

  getTotalQty() {
    let qty = 0;
    this.batches.forEach(batch => {
      qty += batch.quantity ?? 0;
    })
    return qty;
  }
}
