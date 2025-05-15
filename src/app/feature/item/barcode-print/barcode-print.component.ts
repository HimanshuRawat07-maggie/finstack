import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemPrintDetails, ItemWithDetails } from 'src/app/core/api-models/item-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { BarcodePrintModalComponent } from '../barcode-print-modal/barcode-print-modal.component';

@Component({
  selector: 'app-barcode-print',
  templateUrl: './barcode-print.component.html',
  styleUrls: ['./barcode-print.component.scss']
})
export class BarcodePrintComponent implements OnInit {
  items: Array<ItemWithDetails> = [];
  data: Array<any> = [];
  dataClone: Array<any> = [];
  itemData: Array<ItemPrintDetails> = [];
  filterItemText: string = ''

  constructor(private itemService:ItemService,private dialog:MatDialog,private toastr:ToastrService) { }
  
  ngOnInit(){
      const sub = this.itemService.getItemsWithBarcode().subscribe(res => {
      this.items = res.data;
      const productBatchesWithNames = this.items.map((item) => {
        const name = item.name || "";
        const type = item.type || "";
        const batches = item.productBatch || [];
        return batches.map((batch) => ({
          ...batch,
          name: name,
          type:type,
          changePrice: false,
          barCodeCount:null
        }));
      }).flat();
      this.data = productBatchesWithNames;
      this.dataClone = productBatchesWithNames;
      sub.unsubscribe();
    });
  }

  removeData(check:boolean,batchId:number,idx:number) {
    if (!check) {
      let idx = this.itemData.findIndex(x => x.productBatchId == batchId);
      if (idx != -1) {
        this.itemData.splice(idx, 1);
        this.data[idx].barCodeCount=null
      }
    }
  }

  setData(batchId:number,barcodeCount:number,idx:number) {
    let check = this.itemData.findIndex(x => x.productBatchId == batchId);
    if (check != -1) {
      this.itemData[check].barcodeCount = barcodeCount;
    } else {
       this.itemData.push({
        productBatchId: batchId,
        barcodeCount:barcodeCount
        });
    }
  }

   filterItems() {
    if (this.filterItemText?.length > 0) {
      let text = this.filterItemText.toLowerCase();
      this.data = this.dataClone.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.data = [...this.dataClone];
    }
   }
  
  openPrintModal() {
    
    if (this.itemData.length == 0) {
      this.toastr.error('Select Item and Number of Barcodes First');
      return;
    }
    
    for (let index = 0; index < this.data.length; index++) {
      const x = this.data[index];
      if (x.changePrice) {  
        
        if (x.barCodeCount == null) {
          this.toastr.error('Enter Number Of Barcode in All Selected Items');
          return;
        }
      }
      
    }
    
    let dialogRef = this.dialog.open(BarcodePrintModalComponent, {
      autoFocus: false,
      width: '40%',
      data: {
        details: this.itemData
      }
    });
     dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.data.forEach(x => {
          x.changePrice = false;
          x.barCodeCount = null;
        })
      }
    });
  }

}
