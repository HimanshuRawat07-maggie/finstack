import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GstPortal } from 'src/app/core/api-models/company-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';

@Component({
  selector: 'app-gst-portal-modal',
  templateUrl: './gst-portal-modal.component.html',
  styleUrls: ['./gst-portal-modal.component.scss']
})
export class GstPortalModalComponent implements OnInit {
  data: GstPortal = {};
  isLoginFormVisible = true;
  isPasswordVisible = false;

  @ViewChild('gstPortalForm') gstPortalForm?: any;
  @Output() confirmed = new EventEmitter<boolean>();
  constructor(private dialogRef: MatDialogRef<GstPortalModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { gst: string,type:string },
    private companyService: CompanyService, private toastr:ToastrService) { }
 
  ngOnInit(){
    if (this.details.gst) {
      this.data.gst = this.details.gst;
    }
    if (this.details.type == 'invoice') {
      const sub = this.companyService.getGstPortalDetails().subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;
      }
    });
  } else {
      const sub = this.companyService.getGstPortalDetailsEWayBill().subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;
      }
    });
      
   }
  }
  
  close(check: boolean) {    
    this.confirmed.emit(check);
  }

  onSubmit() {
    if (this.isLoginFormVisible) {
      this.gstPortalForm.control.markAllAsTouched();
    }
    if (!this.gstPortalForm.form.valid)
      return;

    if (this.details.type == 'invoice') {
      const sub = this.companyService.gstPortalDetails(this.data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.confirmed.emit(true);
      } else {
        this.toastr.error(res.message);
      }
      });
    } else {
       const sub = this.companyService.gstPortalDetailsEwayBill(this.data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.confirmed.emit(true);
      } else {
        this.toastr.error(res.message);
      }
      });
    }
    
  }

}
