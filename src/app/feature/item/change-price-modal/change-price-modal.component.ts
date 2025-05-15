import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PriceList, ProductDetailRequestDto, updatePriceListDto } from 'src/app/core/api-models/item-group';
import { ItemService } from 'src/app/core/api-services/item/item.service';

@Component({
  selector: 'app-change-price-modal',
  templateUrl: './change-price-modal.component.html',
  styleUrls: ['./change-price-modal.component.scss']
})
export class ChangePriceModalComponent implements OnInit {
  isPercentageEnable = false;
  isIncreaseEnable:string='true'
  details: updatePriceListDto = {
    salePrice:true,
    purchasePrice: false,
    value: 10
  }
    isAmountFormVisible = true;
  
  @ViewChild('amountForm') amountForm?: any;
    @Output() confirmed = new EventEmitter<boolean>();
  constructor(private dialogRef: MatDialogRef<ChangePriceModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { items: Array<ProductDetailRequestDto> },
    private itemService: ItemService,private toastr:ToastrService) { }
 
  ngOnInit(){
    this.details.productDetailRequestDtos=this.data.items
  }
  
  close() {
    this.dialogRef.close();
  }

  toggleDiscountAndAmount() {
    this.isPercentageEnable=!this.isPercentageEnable
  }

  onSubmit() {
       if (this.isAmountFormVisible) {
      this.amountForm.control.markAllAsTouched();
    }
    if (!this.amountForm.form.valid)
      return;

    if (this.details.salePrice==false && this.details.purchasePrice==false) {
      this.toastr.error('Select Price First');
      return;
    }
    if (this.isIncreaseEnable=='true') {
      this.details.increaseEnable=true
    }
    else {
      this.details.increaseEnable=false
    }
    
    if (this.isPercentageEnable) {
      this.details.amountEnable = false;
    } else {
      this.details.amountEnable = true;
    }
    const sub = this.itemService.updatePriceList(this.details).subscribe(res => {
      if (res.code == 200) {
        this.close();
         this.confirmed.emit(true);
      } else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    })
  }

}
