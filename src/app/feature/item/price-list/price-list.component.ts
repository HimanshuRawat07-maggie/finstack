import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item, ItemWithDetails } from 'src/app/core/api-models/item-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ChangePriceModalComponent } from '../change-price-modal/change-price-modal.component';
import { PriceList } from 'src/app/core/api-models/item-group';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  items: Array<ItemWithDetails> = [];
  data: Array<any> = [];
  dataClone: Array<any> = [];
  itemsId: Array<PriceList> = [];
  filterItemText: string = '';
  selectAllItems = false;
  
  constructor(private itemService:ItemService,private dialog:MatDialog,private toastr:ToastrService) { }
  
  ngOnInit(){
    this.loadTableData();
  }

  loadTableData() {
    this.itemsId = [];
     const sub = this.itemService.getAllItemsWithDetails().subscribe(res => {
      this.items = res.data;
      const productBatchesWithNames = this.items.map((item) => {
        const name = item.name || "";
        const type = item.type || "";
        const batches = item.productBatch || [];
        return batches.map((batch) => ({
          ...batch,
          name: name,
          type:type,
          changePrice:false
        }));
      }).flat();
      this.data = productBatchesWithNames;
      this.dataClone = productBatchesWithNames;
      sub.unsubscribe();
    });
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


  getIdForChangePrice(check: boolean, name: string, batch: string, warehouse: string) {    
    if (check == true) { 
      this.itemsId.push(
        {
          productName: name,
          batchName: batch,
          warehouseName:warehouse
        }
      );
    } else {
      this.itemsId = this.itemsId.filter(x => x.productName != name && x.batchName!=batch&& x.warehouseName!=warehouse);
    }
  }

  selectAll() {
    if (this.selectAllItems) {
      this.data.forEach(x => {
        x.ischangePrice = true;
        this.getIdForChangePrice(true, x.name, x.batchName, x.warehouseName)
      });
    } else {
      this.data.forEach(x => {
        x.ischangePrice = false;
      });
      this.itemsId = [];
    }
  }

  openChangePriceModal() {   
    if (this.itemsId.length == 0) {
      this.toastr.error('Select Item First');
      return;
    }
    let dialogref = this.dialog.open(ChangePriceModalComponent, {
      width: '35%',
      autoFocus: false,
      data: {
        items: this.itemsId
      }
    });
     dialogref.afterClosed().subscribe(res => {
       this.loadTableData();
       this.selectAllItems = false;
    });
  }
}
