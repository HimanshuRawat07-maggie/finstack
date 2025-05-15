import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddUser } from 'src/app/core/api-models/company-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { fromEvent } from 'rxjs';
declare function initPayment(key: string, env: string): any;


@Component({
  selector: 'app-add-user-or-ca-modal',
  templateUrl: './add-user-or-ca-modal.component.html',
  styleUrls: ['./add-user-or-ca-modal.component.scss'],
  providers: [CurrencyPipe]
})
export class AddUserOrCaModalComponent implements OnInit {
  data: AddUser = {};
  isAddUserFromVisible = true;
  userType: string = 'User'

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('addUserFrom') addUserFrom?: any;
  constructor(public dialogRef: MatDialogRef<AddUserOrCaModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { type: string, },
    private companyService: CompanyService, private toastr: ToastrService, private dialog: MatDialog, private currencyPipe: CurrencyPipe,
    private userService: UserService) { }

  ngOnInit() {
    if (this.details.type == 'CA') {
      this.userType = 'CA';
    }
  }


  cancel() {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.isAddUserFromVisible) {
      this.addUserFrom.control.markAllAsTouched();
    }
    if (!this.addUserFrom.form.valid)
      return;

    if (this.details.type == 'USER') {
      const sub = this.companyService.addUser(this.data).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
          this.toastr.success('User add successfully');
        } else if (res.code == 402) {
          let dialogRef = this.dialog.open(SubscriptionModalComponent, {
            width: '30%',
            data: {
              title: 'It\'s Time for Your Upgrade',
              message: `You have reached the user limit for this company. Please upgrade to add new users. 
            You can buy access to add ${res.data.split('&')[0].trim()} users in 
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
        sub.unsubscribe();
      });
    }
    else {
      const sub = this.companyService.addCa(this.data).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
          this.toastr.success('CA add successfully');
        } else if (res.code == 402) {
          let dialogRef = this.dialog.open(SubscriptionModalComponent, {
            width: '30%',
            data: {
              title: 'It\'s Time for Your Upgrade',
              message: `You have reached the user limit for this company. Please upgrade to add new users. 
            You can buy access to add ${res.data.split('&')[0].trim()} users in 
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
        sub.unsubscribe();
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

}
