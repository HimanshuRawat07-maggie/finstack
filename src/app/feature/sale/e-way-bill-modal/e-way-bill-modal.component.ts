import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EWayBill } from 'src/app/core/api-models/sale-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';

@Component({
  selector: 'app-e-way-bill-modal',
  templateUrl: './e-way-bill-modal.component.html',
  styleUrls: ['./e-way-bill-modal.component.scss']
})
export class EWayBillModalComponent implements OnInit {
  data: EWayBill = {};
  isEWayBillFormVisible = true;
   minDate: string = '';

  @ViewChild('EWayBillForm') EWayBillForm?: any;
  constructor(public dialogRef: MatDialogRef<EWayBillModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number }, private saleService: SaleService, private toastr: ToastrService) { }
  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.data.id = this.details.id;
  }

  close() {
    this.dialogRef.close(true);
  }

  onSubmit() {
    if (this.isEWayBillFormVisible) {
      this.EWayBillForm.control.markAllAsTouched();
    }
    if (!this.EWayBillForm.form.valid)
      return;

    const sub = this.saleService.generateEWayBill(this.data).subscribe(res => {
      if (res.code == 200) {

      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }
}
