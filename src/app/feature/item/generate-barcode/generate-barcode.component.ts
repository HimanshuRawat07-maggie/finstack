import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemWithDetails } from 'src/app/core/api-models/item-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';

@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.component.html',
  styleUrls: ['./generate-barcode.component.scss']
})
export class GenerateBarcodeComponent implements OnInit {
  data: Array<ItemWithDetails> = [];
  check: boolean = false;
  itemsId: Array<number> = [];
  
  constructor(public dialogRef: MatDialogRef<GenerateBarcodeComponent>, @Inject(MAT_DIALOG_DATA) public details: { type: string },
    private itemService: ItemService,private toastr:ToastrService) { }
  
  ngOnInit(){
     const sub = this.itemService.getAllItemsWithoutBarcode().subscribe(res => {
      if (res.code === 200) {
        this.data = res.data;
        this.data.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
      }
      sub.unsubscribe();
    });
  }

  close() {
    this.dialogRef.close();
  }

  getData(check:boolean,id:number) {
    if (check == true) {
      this.itemsId.push(id);
    } else {
      this.itemsId = this.itemsId.filter(x => x != id);
    }
  }

  onSubmit() {
    if (this.itemsId.length == 0) {
      this.toastr.error('Select Item First');
      return
    }
    const sub = this.itemService.generateBarcode(this.itemsId).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success('Barcode Generated Successfully');
        this.close();
      } else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    })
  }
}
