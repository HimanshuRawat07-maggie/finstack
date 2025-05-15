import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CompanyDetails, GetAllCompany } from 'src/app/core/api-models/company-model';
import { CompanySettings } from 'src/app/core/api-models/company-setting.model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { AppEvents } from 'src/app/core/models/appenums';
import { CurrentUser } from 'src/app/core/models/user';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AddCompanyComponent } from '../../company/add-company/add-company.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { fromEvent } from 'rxjs';
import { DeleteCompanyComponent } from '../delete-company/delete-company.component';
import { ToastrService } from 'ngx-toastr';
import { SubscribeModalComponent } from '../subscribe-modal/subscribe-modal.component';
declare function initPayment(key: string, env: string): any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: CurrentUser;
  isMiniSidebar = false;
  settings: CompanySettings = {};

  data: Array<GetAllCompany> = [];
  companyId: number;
  company: CompanyDetails = {};
  userPermissions: UserPermissions;
  isSidebarOpen = false;
  isSubscriptionActive: boolean = true;
  subscriptionEndDate: Date;
  showSubscriptionBtn: boolean = false;
  constants = Constants;
  isBackIconVisible: boolean = false;

  constructor(private userService: UserService, private appStateService: AppStateService, private router: Router, private dialog: MatDialog,
    private companyService: CompanyService, private authService: AuthenticationService, private authservice: AuthenticationService,
    private toastr: ToastrService, private location: Location, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '/app/dashboard') {
          this.isBackIconVisible = true;
        }
        else {
          this.isBackIconVisible = false;
        }
      }
    });
  }

  ngOnInit() {
    this.appStateService.isMiniSidebar().subscribe(res => { this.isMiniSidebar = res; });
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.appStateService.isSubscriptionActive().subscribe(res => {
      this.isSubscriptionActive = res;
    });
    this.appStateService.getsubscriptionEndsDate().subscribe(res => {
      this.subscriptionEndDate = new Date(res);
    });
    const sub = this.userService.getUserDetail().subscribe(res => {
      this.currentUser = {
        companyLogoUrl: res.data.logo,
        companyName: res.data.companyName,
        companyRole: res.data.companyRole,
        userName: res.data.name,
        userId:res.data.id
      };
      this.appStateService.sendEvent(AppEvents.SetUser, this.currentUser);
      this.appStateService.sendEvent(AppEvents.LoggedIn, true);

      if (this.currentUser.companyRole === 'COMPANY_ADMIN') {
        this.appStateService.sendEvent(AppEvents.SetUserPermission, BusinessHelpers.initAdminPermissions());
        sub.unsubscribe();
      } else {
        const perm = this.userService.getCurrentUserPermission().subscribe(res => {
          this.appStateService.sendEvent(AppEvents.SetUserPermission, res.data[0]);
          perm.unsubscribe();
          sub.unsubscribe();
        });
      }
      this.loadCompany();
    });

    const settingSub = this.companyService.getCompanySettings().subscribe(res => {
      this.settings = res.data;
      this.updateLocalStorage();
      settingSub.unsubscribe();
    });
  }

  loadCompany(type?: string) {
    const selc = this.companyService.getCompanyDetailsById().subscribe(companyRes => {
      this.appStateService.sendEvent(AppEvents.SetCompany, companyRes.data);
      this.companyId = companyRes.data.id;
      const sub = this.companyService.getCompanies().subscribe(res => {
        this.data = res.data;
        if (this.data.length == 0) {
          this.openModal();
        } else {
          this.data.sort((a, b) => {
            if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
            if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
            return 0;
          });
          this.data = [...this.data.filter(x => x.name == this.currentUser.companyName), ...this.data.filter(x => x.name != this.currentUser.companyName)];
          if (type == 'add') {
            this.switchCompany(this.data[this.data.length - 1]?.id);
          }
        }
        let company = this.data.find(x => x.id === this.companyId);
        if (company) {
          let daysDiff = Math.floor((company.licenseValidUpto - (new Date()).getTime()) / (1000 * 60 * 60 * 24));
          this.showSubscriptionBtn = daysDiff <= 14;
          this.appStateService.sendEvent(AppEvents.SetSubscriptionEndDate, company.licenseValidUpto);
          this.appStateService.sendEvent(AppEvents.SetSubscriptionStatus, company.licenseType != 'TRIAL');
        }
        sub.unsubscribe();
        selc.unsubscribe();
      });
    });
  }

  switchCompany(id: number) {
    if (this.companyId != id) {
      this.companyId = id
      const sub = this.companyService.companySwitch(this.companyId).subscribe(res => {
        this.company = res.data;
        this.authservice.token = res.data.token;
        this.router.navigateByUrl('/app/dashboard/');
        this.appStateService.sendEvent(AppEvents.SetUser, res.data);
        this.appStateService.sendEvent(AppEvents.LoggedIn, true);
        setTimeout(() => { window.location.reload(); }, 500);
        localStorage.removeItem(this.authService.isEInvoiceEnabled);
        localStorage.removeItem(this.authService.isEWayBillEnabled);
        sub.unsubscribe();
      });
    }
  }

  openModal() {
    let dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type:'add'
      }
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadCompany('add');
        dialogRef.close(true);
      }
    });
  }

  updateLocalStorage() {
    this.authService.isBatchEnabled = this.settings['batch.enabled'] ?? 'false';
    this.authService.isEInvoiceEnabled = this.settings['einvoicing.enabled'] ?? 'false';
    this.authService.isEWayBillEnabled = this.settings['ewaybilling.enabled'] ?? 'false';
    this.authService.isManufacturnigEnabled = this.settings['manufacturing.enabled'] ?? 'false';
    this.authService.isWarehouseEnabled = this.settings['warehouse.enabled'] ?? 'false';
    this.authService.isDiscountEnabled = this.settings['discount.enabled'] ?? 'false';
    localStorage.setItem('minDate', this.settings['book.startingfrom']);
  }

  toggleSidebar() {
    this.isMiniSidebar = !this.isMiniSidebar;
    this.appStateService.sendEvent(AppEvents.SidebarToggle, this.isMiniSidebar);
  }

  logOut() {
    localStorage.clear();
    this.appStateService.sendEvent(AppEvents.LoggedIn, false);
    this.router.navigateByUrl('login');
  }

  toggleSidebarRight() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  hasPermissionForCompanySetting(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.CompanySettings, permissionValue);
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Company, permissionValue);
  }

  getFirstNameLetter() {
    if (this.currentUser?.userName?.length > 0) {
      return this.currentUser.userName.substring(0, 1).toUpperCase();
    } else {
      return '';
    }
  }

  // initiatePayment() {
  //   const sub = this.userService.initiatePayment().subscribe(res => {
  //     if (res.data) {
  //       let appKey = res.data.data;
  //       let environment = res.data.environment;
  //       initPayment(appKey, environment);
  //       const paymentSub = fromEvent(window, 'paymentResponse').subscribe((event: any) => {
  //         this.saveTransactionDetails(event);
  //         this.loadCompany();
  //         paymentSub.unsubscribe();
  //         sub.unsubscribe();
  //       });
  //     } else {
  //       sub.unsubscribe();
  //     }
  //   });
  // }

   openSubscribeModal() {
      let dialogRef = this.dialog.open(SubscribeModalComponent, {
      autoFocus: false,
      width: '30%',
      data: {},
    });
    // dialogRef.componentInstance.confirmed.subscribe(res => {
    //   if (res) {
    //     this.loadCompany();
    //   }
    // });
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

  openDeleteCompanyDialog(id: number) {
    let dialogRef = this.dialog.open(DeleteCompanyComponent, {
      width: '50%',
      data: {},
    });
    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        if (this.data.length == 1) {
          this.logOut();
        } else {
          // debugger;
          let idx = this.data.length
          this.switchCompany(this.data[idx - 1].id);
          console.log(this.data[idx - 1]);
        }
      }
    });
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

  goBack() {
    this.location.back();
  }
}
