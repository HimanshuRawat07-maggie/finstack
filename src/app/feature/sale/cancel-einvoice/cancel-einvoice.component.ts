import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { cancelEInvoice } from 'src/app/core/api-models/report-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';

@Component({
  selector: 'app-cancel-einvoice',
  templateUrl: './cancel-einvoice.component.html',
  styleUrls: ['./cancel-einvoice.component.scss']
})
export class CancelEinvoiceComponent {
  data: cancelEInvoice = {};
  iscancelEInvoiceFormVisible = true;

  @ViewChild('cancelEInvoiceForm') cancelEInvoiceForm?: any;
  constructor(private dialogRef: MatDialogRef<CancelEinvoiceComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number },
  private saleService:SaleService,private toastr:ToastrService) { }
  
  close(check:boolean){
    this.dialogRef.close(check);
  }

  onSubmit() {
    if (this.iscancelEInvoiceFormVisible) {
      this.cancelEInvoiceForm.control.markAllAsTouched();
    }
    if (!this.cancelEInvoiceForm.form.valid)
      return;
    if (this.details.id) {
      this.data.id = this.details.id;
    }
    this.data.reason = parseInt(this.data.reason as any);
    const sub = this.saleService.cancelEInvoice(this.data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.close(true);
      } else {    
        this.toastr.error(res.message);
      }
    })
  }
}
