import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';

@Component({
  selector: 'app-add-godown',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent implements OnInit {
  status: string = 'Add';
  data: Warehouse = {};
  isGodownFormVisible = true;
  id: number = NaN;


  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('GodownForm') GodownForm?: any;

  constructor(public dialogRef: MatDialogRef<AddWarehouseComponent>, @Inject(MAT_DIALOG_DATA) public detail: { id: number }, private warehouseService: WarehouseService, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.detail.id != null) {
      this.status = 'Edit'
      this.id = this.detail.id;
      const sub = this.warehouseService.getWarehouseById(this.id).subscribe(res => {
        this.data = res.data;
        sub.unsubscribe();
      });
    }
  }

  onSubmit() {
    if (this.isGodownFormVisible) {
      this.GodownForm.control.markAllAsTouched();
    }
    if (!this.GodownForm.form.valid)
      return;

    if (this.detail.id == null) {
      const sub = this.warehouseService.saveWarehouse(this.data).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close();
          this.toastr.success('Data saved successfully');
          this.confirmed.emit(true);
        }
        else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    }
    else {
      const subs = this.warehouseService.updateWarehouseDetail(this.data).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close();
          this.toastr.success('Data updated successfully');
          this.confirmed.emit(true);
        }
        else {
          this.toastr.error(res.message);
        }
        subs.unsubscribe();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
