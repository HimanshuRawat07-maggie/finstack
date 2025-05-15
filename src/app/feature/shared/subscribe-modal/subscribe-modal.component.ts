import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { UserService } from 'src/app/core/api-services/user/user.service';
declare function initPayment(key: string, env: string): any;

@Component({
  selector: 'app-subscribe-modal',
  templateUrl: './subscribe-modal.component.html',
  styleUrls: ['./subscribe-modal.component.scss']
})
export class SubscribeModalComponent {
  radioBtnValue = '';
  code:string=null

  @Output() confirmed = new EventEmitter<boolean>();
  constructor(public dialogRef: MatDialogRef<SubscribeModalComponent>, private userService: UserService,
    private companyService: CompanyService, private toastr: ToastrService) { }
  
  close() {
    this.dialogRef.close();
  }

  initiatePayment() {
    const sub = this.userService.initiatePayment().subscribe(res => {
      if (res.data) {
        let appKey = res.data.data;
        let environment = res.data.environment;
        initPayment(appKey, environment);
        const paymentSub = fromEvent(window, 'paymentResponse').subscribe((event: any) => {
          this.saveTransactionDetails(event);
          paymentSub.unsubscribe();
          sub.unsubscribe();
        });
      } else {
        sub.unsubscribe();
      }
    });
  }

   saveTransactionDetails(event: any) {
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
    });
   }
  
  onSubmit() {
    const sub = this.companyService.getSubscriptionByCode(this.code).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
        window.location.reload();
      } else {
        this.toastr.error(res.message);
      }
      });
  }
  
}
