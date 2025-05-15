import { CurrencyPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { CompanyLimits, GetInvoiceTemplate, InvoiceTemplates, PaymentTransaction } from 'src/app/core/api-models/company-model';
import { CompanySettings } from 'src/app/core/api-models/company-setting.model';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { AppEvents } from 'src/app/core/models/appenums';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { GstPortalModalComponent } from '../gst-portal-modal/gst-portal-modal.component';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { Bank } from 'src/app/core/api-models/bank-model';
import { WindowRefService } from 'src/app/core/api-services/gateway/windowref.service';
declare function initPayment(key: string, env: string): any;

@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.scss'],
  providers: [CurrencyPipe]
})
export class CompanySettingComponent implements OnInit {
  public settings: CompanySettings = {};
  userPermissions: UserPermissions;
  constants = Constants;
  isSubscriptionActive: boolean = true;
  subscriptionEndDate: Date;
  companyLimit: CompanyLimits;
  templates: Array<InvoiceTemplates> = [];
  banks: Bank[] = [];
  defaultBankId: number = NaN;
  selectedInvoiceTemplate = NaN;
  theme: GetInvoiceTemplate = {};

  constructor(private companyService: CompanyService, private authService: AuthenticationService, private toastr: ToastrService,
    private location: Location, private appStateService: AppStateService, private userService: UserService, private dialog: MatDialog,
    private currencyPipe: CurrencyPipe,private winRef: WindowRefService,private bankService:BankService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.appStateService.isSubscriptionActive().subscribe(res => {
      this.isSubscriptionActive = res;
    });
    this.appStateService.getsubscriptionEndsDate().subscribe(res => {
      this.subscriptionEndDate = new Date(res);
    });
    this.getCompanyLimits();
    const hub = this.companyService.getInvoiceTemplates().subscribe(res => {
      this.templates = res.data;
      const invoice = this.companyService.getCompanyInvoiceTheme().subscribe(res => {
        this.theme = res.data;
        if (res.data == null || (res.data != null && this.theme.colorCode == null)) {
          this.theme = {
            themeId: undefined,
            colorCode: '#000000'
          }
        }
        if (this.theme) {
          let idx = this.templates.findIndex(x => x.id == this.theme.themeId);
          if (idx != -1) {
            this.templates[idx].isDefault = true;
          }
        }
        invoice.unsubscribe();
      });
      hub.unsubscribe();
    });
    const paymment = this.bankService.getAllBankDetails().subscribe(res => {
      this.banks = res.data;
      for (let i = 0; i < this.banks.length; i++){
        if (this.banks[i].isDefault == true) {
          this.defaultBankId = this.banks[i].id;
          break;
        }
      }
      paymment.unsubscribe();
    })
    
    this.loaddata();
  }

  loaddata() {
    const sub = this.companyService.getCompanySettings().subscribe(res => {
      this.settings = res.data;
      this.updateLocalStorage();
      sub.unsubscribe();
    });
  }

  changeDefaultTemplate(id: number,index:number) {
    this.theme.themeId = id;
    this.templates.forEach(x => {
      x.isDefault = false
    });
    this.templates[index].isDefault = true;
  }

  getCompanyLimits() {
    const sub = this.companyService.getLimits().subscribe(res => {
      this.companyLimit = res.data;
      sub.unsubscribe();
    });
  }

  updateLocalStorage() {
    this.authService.isBatchEnabled = this.settings['batch.enabled'] ?? 'false';
    this.authService.isEInvoiceEnabled = this.settings['einvoicing.enabled'] ?? 'false';
    this.authService.isEWayBillEnabled = this.settings['ewaybilling.enabled'] ?? 'false';
    this.authService.isManufacturnigEnabled = this.settings['manufacturing.enabled'] ?? 'false';
    this.authService.isWarehouseEnabled = this.settings['warehouse.enabled'] ?? 'false';
    this.authService.isDiscountEnabled = this.settings['discount.enabled'] ?? 'false';
    this.appStateService.sendEvent(AppEvents.UpdateCompanySettings, true);
  }

  updateSettings() {    
    if (this.defaultBankId) {    
      const bank = this.bankService.setDefaultBank(this.defaultBankId).subscribe(response => {
        bank.unsubscribe();
      });
    }

    if (this.settings['batch.enabled'] == 'false') {
      this.settings['pdf.barcode.enabled'] = 'false';
      this.settings['pdf.batchname.enabled'] = 'false';
      this.settings['pdf.mfg.enabled'] = 'false';
      this.settings['pdf.exp.enabled'] = 'false';
    }
    
    const sub = this.companyService.saveCompanySettings(this.settings).subscribe(res => {
      if (res.code == 200) {
        this.settings = res.data;
        const invoice = this.companyService.saveCompanyInvoiceTheme(this.theme).subscribe(res => {
          this.toastr.success('Data Updated Successfully');
          invoice.unsubscribe();
        });
        this.updateLocalStorage();
      }
      else {
        this.toastr.error(res.message);
        this.loaddata();
      }
      sub.unsubscribe();
    });
  }

  checkGstDetail(check: string,type:string) {
    if (check=='true') {      
    const sub = this.companyService.getCompanyDetailsById().subscribe(res => {
      if (res.data.gst) {
        this.openGstPortalModal(res.data.gst,type)
      } else {
        this.toastr.error('Fill Up GSTIN in Company Details first');
        if (type =='invoice') {
          this.settings['einvoicing.enabled'] = 'false';
        } else {
          this.settings['ewaybilling.enabled'] = 'false';
        }
      }
    });
    }
  }

  openGstPortalModal(gst:string,type:string){
    let dialogRef = this.dialog.open(GstPortalModalComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        gst: gst,
        type:type
      }
    });
    dialogRef.afterClosed().subscribe(res => {  
        this.loaddata();
    })
    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (!res) {

      } else {
        this.updateSettings();
      }
      dialogRef.close(true);
    });
  }

  goBack() {
    this.location.back();
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.CompanySettings, permissionValue);
  }

  getSubscriptionEndingDate() {
    return new Date(this.subscriptionEndDate)
  }

  getSubscriptionMessage() {
    let daysDiff = Math.floor((this.subscriptionEndDate.getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0)
      return `${this.isSubscriptionActive ? 'Subscription' : 'Trial Period'} Ended `;
    else
      return `${this.isSubscriptionActive ? 'Subscription' : 'Trial Period'}  Ends `;
  }

  initiateEInvoicingPayment() {
    let dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '30%',
      data: {
        title: 'Buy E-Invoicing API Requests',
        message: `You can buy access to ${this.companyLimit.einvoiceBillIncreaseBy} API requests in 
            <strong>${this.currencyPipe.transform(this.companyLimit.einvoiceBillRenewAmount, 'INR', 'symbol', '1.2-2')}</strong>`,
        btnText: 'Buy Now'
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const sub = this.userService.initiateEInvoicingPayment().subscribe(res => {
          if (res.data) {
             this.payWithRazor(res)
            // let appKey = res.data.data;
            // let environment = res.data.environment;
            // initPayment(appKey, environment);
            // const paymentSub = fromEvent(window, 'paymentResponse').subscribe((event: any) => {
            //   this.saveTransactionDetails(event);
            //   paymentSub.unsubscribe();
            // });
            sub.unsubscribe();
          } else {
            sub.unsubscribe();
          }
        });
      }
    });
  }

  initiateEWayBillPayment() {
    let dialogRef = this.dialog.open(SubscriptionModalComponent, {
      width: '30%',
      data: {
        title: 'Buy E-Way Bill API Requests',
        message: `You can buy access to ${this.companyLimit.ewayBillIncreaseBy} API requests in 
            <strong>${this.currencyPipe.transform(this.companyLimit.ewayBillRenewAmount, 'INR', 'symbol', '1.2-2')}</strong>`,
        btnText: 'Buy Now'
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const sub = this.userService.initiateEWayBillPayment().subscribe(res => {
          if (res.data) {
             this.payWithRazor(res)
            // let appKey = res.data.data;
            // let environment = res.data.environment;
            // initPayment(appKey, environment);
            // const paymentSub = fromEvent(window, 'paymentResponse').subscribe((event: any) => {
            //   this.saveTransactionDetails(event);
            //   paymentSub.unsubscribe();
            // });
            sub.unsubscribe();
          } else {
            sub.unsubscribe();
          }
        });
      }
    });
  }

  
  payWithRazor(res:any) {
    const options: any = {
      // key: environment.razorPayKey,
      amount: res.data.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Hawks Fintech', // company name or product name
      description: '',  // product description
      image: '../../../../assets/images/fav.jpg', // company logo or product image
      order_id: res.data.id, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      prefill: {
        email: '',
        name: '',
        contact:'',
      },
      
      theme: {
        color: '#7539FF'
      }
    };
    options.handler = ((response: any, error: any) => {
      options.response = response;
      if (error) {
        this.toastr.error(error);
      }
      let res: PaymentTransaction = {
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        razorpayPaymentId:response.razorpay_payment_id
      }
      if (res) {
        this.saveTransactionDetails('',res)
      }
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }


  saveTransactionDetails(event?: any,res?:PaymentTransaction) {
    // if (event.detail.status.toLowerCase() == 'success') {
    //   this.toastr.success('Payment Successfull');
    // } else if (event.detail.status.toLowerCase() == 'usercancelled') {
    //   this.toastr.warning('Payment Cancelled');
    // } else if (event.detail.status.toLowerCase() == 'failure') {
    //   this.toastr.error(event.detail.error);
    // } else {
    //   this.toastr.error('Something went wrong. Please try after sometime');
    // }
    const transactionSub = this.userService.saveTransactionDetails(res).subscribe(response => {
      this.getCompanyLimits();
      transactionSub.unsubscribe();
    });
  }
}
