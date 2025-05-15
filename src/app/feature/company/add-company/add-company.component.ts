import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyDetails, SplitCompany } from 'src/app/core/api-models/company-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { CurrencyPipe } from '@angular/common';
import { fromEvent } from 'rxjs';
import { UserService } from 'src/app/core/api-services/user/user.service';
declare function initPayment(key: string, env: string): any;

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [CurrencyPipe]
})
export class AddCompanyComponent implements OnInit {
  isAddCompanyFormVisible = true;
  data: CompanyDetails = {};
  status: string = 'Add';
  minDate: string = '';
  splitCompany: SplitCompany = {};

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('AddCompanyForm') AddCompanyForm?: any;;
  constructor(public dialogRef: MatDialogRef<AddCompanyComponent>, @Inject(MAT_DIALOG_DATA) public details: { type:string }, private companyService: CompanyService, private toastr: ToastrService,
    private dialog: MatDialog, private currencyPipe: CurrencyPipe, private userService: UserService) { }
  
  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    if (this.details.type=='split') {
      this.status='Split'
    }
  }

  onSubmit() {
    if (this.isAddCompanyFormVisible) {
      this.AddCompanyForm.control.markAllAsTouched();
    }
    if (!this.AddCompanyForm.form.valid)
      return;

    if (this.details.type=='add') {
      this.companyService.addCompany(this.data).subscribe(res => {
      if (res.code == 200) {
        this.dialogRef.close();
        this.toastr.success('Company added successfully');
        this.confirmed.emit(true);
      } else if (res.code == 402) {
        let dialogRef = this.dialog.open(SubscriptionModalComponent, {
          width: '30%',
          data: {
            title: 'It\'s Time for Your Upgrade',
            message: `You have reached the company limit. Please upgrade to create new companies. 
            You can buy access to create ${res.data.split('&')[0].trim()} companies in 
            <strong>${this.currencyPipe.transform(res.data.split('&')[1].trim(), 'INR', 'symbol', '1.2-2')}</strong>`,
            btnText: 'Upgrade'
          },
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.initiatePayment();
          }
        });
      } else {
        this.toastr.error(res.message);
      }
    });
    } else {
      this.splitCompany.name=this.data.name
       this.companyService.splitCompany(this.splitCompany).subscribe(res => {
      if (res.code == 200) {
        this.dialogRef.close();
        this.toastr.success('Company added successfully');
        this.confirmed.emit(true);
      } else if (res.code == 402) {
        let dialogRef = this.dialog.open(SubscriptionModalComponent, {
          width: '30%',
          data: {
            title: 'It\'s Time for Your Upgrade',
            message: `You have reached the company limit. Please upgrade to create new companies. 
            You can buy access to create ${res.data.split('&')[0].trim()} companies in 
            <strong>${this.currencyPipe.transform(res.data.split('&')[1].trim(), 'INR', 'symbol', '1.2-2')}</strong>`,
            btnText: 'Upgrade'
          },
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.initiatePayment();
          }
        });
      } else {
        this.toastr.error(res.message);
      }
    });
    }
  }

  initiatePayment() {
    const sub = this.companyService.initiatePaymentForCompanies().subscribe(res => {
      if (res.data) {
        let appKey = res.data.data;
        let environment = res.data.environment;
        initPayment(appKey, environment);
        const paymentSub = fromEvent(window, 'paymentResponse').subscribe((event: any) => {
          if (event.detail.status.toLowerCase() == 'success') {
            this.toastr.success('Payment Successfull');
          } else if (event.detail.status.toLowerCase() == 'usercancelled') {
            this.toastr.warning('Payment Cancelled');
          } else if (event.detail.status.toLowerCase() == 'failure') {
            this.toastr.error(event.detail.error);
          } else {
            this.toastr.error('Something went wrong. Please try after sometime');
          }
          const transactionSub = this.userService.saveTransactionDetails(event.detail).subscribe(response => {
            transactionSub.unsubscribe();
            paymentSub.unsubscribe();
            sub.unsubscribe();
          });
          paymentSub.unsubscribe();
          sub.unsubscribe();
        });
      } else {
        sub.unsubscribe();
      }
    });
  }

  cancel() {
    this.dialogRef.close()
  }
}
