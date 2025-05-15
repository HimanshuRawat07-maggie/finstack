import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/core/api-models/bank-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss']
})
export class AddBankComponent {
  status: string = 'Add';
  data: Bank = {isDefault:false};
  isBankFormVisible = true;
  id: number = NaN;
  minDate: string = '';
  isDefault: false;
  qrCode: any;
  formData: FormData;
  cloneQrCode: any
  isQrCodeDeleted = false;
  isSubmitButtonDisable = false;

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('BankForm') BankForm?: any;
  constructor(public dialogRef: MatDialogRef<AddBankComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number }, private datePipe: DatePipe, private toastr: ToastrService, private bankService: BankService) { }


  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.data.asOfDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    if (this.details.id != null) {
      this.status = 'Edit';
      this.id = this.details.id;
      const sub = this.bankService.getAllBankDetailById(this.id).subscribe(res => {
        this.data = res.data;
        if (this.data.qrCode) {
          this.qrCode = this.data.qrCode;          
          this.cloneQrCode = this.data.qrCode;          
        }
        sub.unsubscribe();
      })
    }
  }

  onQrChange(event: any) {    
    let file = event.target.files[0];
    this.cloneQrCode = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.qrCode = reader.result;
      };
      reader.readAsDataURL(file);
    }
    this.qrCode = file;
    this.isQrCodeDeleted=true
  }

  removeQrCode() {    
    this.qrCode = null;
    this.cloneQrCode = null;
    if (this.status == 'Edit') {
      this.isQrCodeDeleted = true;
    }
  }

  onSubmit() {
    if (this.isBankFormVisible) {
      this.BankForm.control.markAllAsTouched();
    }
    if (!this.BankForm.form.valid) {
      this.isSubmitButtonDisable = false;
      return;
    }

    const formData = new FormData();
    formData.append('id', this.data.id ? JSON.stringify(this.data.id) : '0');
    if (this.data.bankName) {
      formData.append('bankName', this.data.bankName ? this.data.bankName: '');
    }
    if (this.data.accountDisplayName) {
      formData.append('accountDisplayName', this.data.accountDisplayName?this.data.accountDisplayName:'');
    }
    if (this.data.openingBalance) {
      formData.append('openingBalance', this.data.openingBalance ? JSON.stringify(this.data.openingBalance) : JSON.stringify(0.0));
    }
    if (this.data.totalBalance) {
      formData.append('totalBalance', this.data.totalBalance ? JSON.stringify(this.data.totalBalance) : '');
    }
    if (this.data.asOfDate) {
      formData.append('asOfDate', this.data.asOfDate ? this.data.asOfDate : '');
    }
    if (this.data.accountName) {
      formData.append('accountName', this.data.accountName ? this.data.accountName : '');
    }
    if (this.data.accountNumber) {
      formData.append('accountNumber', this.data.accountNumber ?this.data.accountNumber.toString(): '');
    }
    if (this.data.branch) {
      formData.append('branch', this.data.branch ? this.data.branch.toString() : '');
    }
    if (this.data.ifscCode) {
      formData.append('ifscCode', this.data.ifscCode);
    }
    if (this.isQrCodeDeleted && this.qrCode!=null) {
      formData.append('qrCode', this.cloneQrCode?this.cloneQrCode:null);
    }
    if (this.status == 'Edit') {
      formData.append('isQrCodeDeleted', JSON.stringify(this.isQrCodeDeleted));
    }
    formData.append('isDefault',this.data.isDefault.toString());

    if (this.details.id == null) {
      const sub = this.bankService.saveBankDetails(formData).subscribe(res => {
        if (res.code == 200) {
          this.toastr.success(res.message);
          this.dialogRef.close();
          this.confirmed.emit(true);
        }
        else {
          this.toastr.error(res.message);
        }
        this.isSubmitButtonDisable = false;
        sub.unsubscribe();
      });
    }
    else {
      const subs = this.bankService.updateBankDetails(formData).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close();
          this.toastr.success(res.message);
          this.confirmed.emit(true);
        }
        else {
          this.toastr.error(res.message);
        }
        this.isSubmitButtonDisable = false;
        subs.unsubscribe();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
