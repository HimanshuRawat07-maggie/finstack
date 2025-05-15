import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/api-services/company/company.service';

@Component({
  selector: 'app-delete-company',
  templateUrl: './delete-company.component.html',
  styleUrls: ['./delete-company.component.scss']
})
export class DeleteCompanyComponent {
  password: string = '';
  checkField = false;
  isdeleteCompanyFormVisible = true

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('deleteCompanyForm') deleteCompanyForm?: any;
  constructor(public dialogRef: MatDialogRef<DeleteCompanyComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string },
    private toastr: ToastrService, private companyService: CompanyService) { }

  cancel() {
    this.dialogRef.close(true);
  }

  onSubmit() {
    if (this.isdeleteCompanyFormVisible) {
      this.deleteCompanyForm.control.markAllAsTouched();
    }
    if (!this.deleteCompanyForm.form.valid)
      return;
    if (this.checkField == true) {
      const sub = this.companyService.deleteCompany(this.password).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
        }
        else {
          this.toastr.error(res.message);
        }
        // sub.unsubscribe();
      });
    }
    else {
      this.toastr.error("Please check the box to confirm that you have read and agree to the company's deletion policy before proceeding.");
    }
  }

}
