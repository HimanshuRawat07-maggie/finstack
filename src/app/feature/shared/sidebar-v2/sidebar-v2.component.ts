import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { AppEvents } from 'src/app/core/models/appenums';
import { CurrentUser } from 'src/app/core/models/user';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AddCompanyComponent } from '../../company/add-company/add-company.component';
import { MatDialog } from '@angular/material/dialog';
import { GenerateBarcodeComponent } from '../../item/generate-barcode/generate-barcode.component';
import { ImportDataModalComponent } from '../../company/import-data-modal/import-data-modal.component';
import { ImportExportModalComponent } from '../import-export-modal/import-export-modal.component';
import { color } from 'html2canvas/dist/types/css/types/color';

@Component({
  selector: 'app-sidebar-v2',
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.scss']
})
export class SidebarV2Component {
  public isMiniSidebar = false;
  currentUser: CurrentUser;
  base = 'dashboard';
  currentRoute = '';
  userPermissions: UserPermissions;
  constants = Constants;
  isWarehouseEnabled: boolean = false;
  isManufactureEnabled: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  side_bar_data: any[] = [];
  expandAll = false;
  activeSubSubmenu = '';

  constructor(public router: Router, private appStateService: AppStateService, private authService: AuthenticationService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,private dialog:MatDialog) {
    this.matIconRegistry.addSvgIcon(
      `barcode-generate`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/barcode-generate.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `barcode-print`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/barcode-print.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `price-list`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/price-list.svg")
    );
  }

  ngOnInit() {
    this.appStateService.isMiniSidebar().subscribe(res => { setTimeout(() => { this.isMiniSidebar = res; }, 0) });
    this.appStateService.currentUser().subscribe(res => { this.currentUser = res; });
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.appStateService.getCompanySettings().subscribe(res => {
      this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
      this.isManufactureEnabled = this.authService.isManufacturnigEnabled == 'true';
    });

    this.currentRoute = this.router.url;
    this.initSidebar();
    this.side_bar_data.forEach(mainMenu => {
      if (mainMenu.menu) {
        let submenu = mainMenu.menu;
        if (submenu.map((x: any) => x.route).includes(this.currentRoute)) {
          mainMenu.showSubRoute = true;
          this.base = mainMenu.base;
        } else {
          submenu.forEach((subSubmenu: any) => {
            if (subSubmenu.menu) {
              subSubmenu.menu.forEach((x: any) => {
                if (x.route.includes(this.currentRoute)) {
                  mainMenu.showSubRoute = true;
                  subSubmenu.showSubRoute = true;
                  this.activeSubSubmenu = subSubmenu.base;
                  this.base = mainMenu.base;
                }
              });
            }
          });
        }
      } else {
        if (mainMenu.route?.includes(this.currentRoute)) {
          this.base = mainMenu.base;
        }
      }
    });
  }

  initSidebar() {
    this.side_bar_data = [
      {
        title: 'CA & Consultant (Free)',
        faIcon: 'fa-solid fa-users',
        route: '/app/users/ca',
        base: 'ca-consultant-access',
        color:'#f654f6',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Dashboard',
        color:'#1e90ff',
        matIcon: 'dashboard',
        base: 'dashboard',
        route: '/app/dashboard/',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Accounts Masters',
         color:'#30e5a8',
        faIcon: 'fa-solid fa-cash-register',
        hasPermission: () => { return true; },
        base: 'account-masters',
        showSubRoute: false,
        menu: [
          {
            title: 'Group',
            // faIcon: 'fa-solid fa-layer-group',
            route: '/app/master/groups',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'group',
            hasPermission: () => { return true; },
          },
          {
            title: 'Party',
            // faIcon: 'fa-solid fa-handshake',
            route: '/app/party/dashboard',
            base: 'party',
            hasPermission: () => { return true; },
          },
          {
            title: 'Ledger',
            route: '/app/master/ledger',
            // faIcon: 'fa-solid fa-money-bill-transfer',
            base: 'ledger',
            hasPermission: () => { return true; },
          },
          {
            title: 'Bank',
            route: '/app/asset/bank',
            // faIcon: 'fa-solid fa-building-columns',
            base: 'bank',
            hasPermission: () => { return true; },
          }
        ]
      },
      {
        title: 'Barcode',
         color:'black',
        faIcon: 'fa-solid fa-barcode',
        hasPermission: () => { return true; },
        showSubRoute: false,
        base: 'barcode',
        menu: [
          {
            title: 'Barcode Generate',
            // route: '',
            // svg: 'barcode-generate',
            base: 'barcode-generate',
            hasPermission: () => { return true; },
          },
          {
            title: 'Barcode Print and Details',
            route: '/app/item/barcode-print',
            // svg: 'barcode-print',
            base: 'barcode-print',
            hasPermission: () => { return true; },
          },
        ]
      },
      {
        title: 'Inventory Masters',
         color:'orange',
        faIcon: 'fa-solid fa-boxes-stacked',
        hasPermission: () => { return true; },
        showSubRoute: false,
        base: 'inventory-masters',
        menu: [
          {
            title: 'Item / Service',
            route: '/app/item/dashboard',
            // faIcon: 'fa fa-box',
            base: 'product-service',
            hasPermission: () => { return true; },
          },
          {
            title: 'Item Group',
            route: '/app/item/group',
            // faIcon: 'fa-solid fa-sitemap',
            base: 'product-group',
            hasPermission: () => { return true; },
          },
          {
            title: 'Godown',
            route: '/app/item/warehouse',
            // faIcon: 'fa-solid fa-warehouse',
            base: 'warehouse',
            hasPermission: () => { return true; },
          },
          {
            title: 'Price List',
            route: '/app/item/price-list',
            // svg: 'price-list',
            base: 'price-list',
            hasPermission: () => { return true; },
          },
        ]
      },
      {
        title: 'Sales',
         color:'#4CAF50',
        faIcon: 'fa-solid fa-tag',
        base: 'sale-option',
        showSubRoute: false,
        hasPermission: () => { return true; },
        menu: [
          {
            title: 'Sales Order',
            route: '/app/sale/order',
            // faIcon: 'fa fa-clipboard-list',
            base: 'sale-order',
            hasPermission: () => { return true; },
          },
          // {
          //   title: 'Challan-Out',
          //   route: '/app/sale/challan-out',
          //   // faIcon: 'fa fa-clipboard-list',
          //   base: 'challan-out',
          //   hasPermission: () => { return this.hasPermission(ModuleConstants.ChallanOut, this.constants.View); }, 
          // },
          {
            title: 'Retail Invoice',
            route: '/app/sale/invoice',
            // faIcon: 'fa-receipt fa-solid',
            base: 'sale-invoice',
            hasPermission: () => { return true; },
          },
          {
            title: 'Tax Invoice',
            route: '/app/sale/tax-invoice',
            // faIcon: 'fa-solid fa-group-arrows-rotate',
            base: 'tax-invoice',
            hasPermission: () => { return true; },
          },
          {
            title: 'POS Invoice',
            route: '/app/sale/pos-invoice',
            // faIcon: 'fa-file-invoice fa-solid',
            base: 'pos-invoice',
            hasPermission: () => { return true; },
          },
          {
            title: 'Export Invoice',
            route: '/app/sale/export-invoice',
            // faIcon: 'fa-bars fa-solid',
            base: 'export-invoice',
            hasPermission: () => { return true; },
          },
          {
            title: 'Service Invoice',
            route: '/app/sale/service-invoice',
            // faIcon: 'fa-bars fa-solid',
            base: 'service-invoice',
            hasPermission: () => { return true; },
          },
          {
            title: 'Sales Assets',
            route: '/app/sale/assets',
            // faIcon: 'fa-bars fa-solid',
            base: 'sales-assets',
            hasPermission: () => { return true; },
          },
          {
            title: 'Sales Return',
            route: '/app/sale/return',
            // faIcon: 'fa fa-arrow-rotate-left',
            base: 'sale-return',
            hasPermission: () => { return true; },
          },
        ]
      },
      {
        title: 'Purchase',
         color:'#1e90ff',
        faIcon: 'fa-solid fa-hand-holding-dollar',
        base: 'purchase-option',
        showSubRoute: false,
        hasPermission: () => { return true; },
        menu: [
          {
            title: 'Purchase Order',
            route: '/app/purchase/order',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'purchase-order',
            hasPermission: () => { return true; },
          },
          // {
          //   title: 'Challan-In',
          //   route: '/app/purchase/challan-in',
          //   // icon: 'fa-solid fa-group-arrows-rotate',
          //   base: 'challan-in',
          //   hasPermission: () => { return true; },
          // },
          {
            title: 'Purchase Bills',
            route: '/app/purchase/bills',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'purchase-bills',
            hasPermission: () => { return true; },
          },
          {
            title: 'Purchase Assets',
            route: '/app/purchase/assets',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'purchase-assets',
            hasPermission: () => { return true; },
          },
          {
            title: 'Purchase Return',
            route: '/app/purchase/return',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'purchase-return',
            hasPermission: () => { return true; },
          },
        ]
      },
      {
        title: 'Entries',
         color:'#ff5d48',
        faIcon: 'fa-solid fa-file-pen',
        base: 'entries',
        showSubRoute: false,
        hasPermission: () => { return true; },
        menu: [
          {
            title: 'Payment',
            route: '/app/other-entries/payment-in',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'payment-in',
            hasPermission: () => { return true; },
          },
          {
            title: 'Receipt',
            route: '/app/other-entries/payment-out',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'payment-out',
            hasPermission: () => { return true; },
          },
          {
            title: 'Journal',
            route: '/app/other-entries/journal',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'journal',
            hasPermission: () => { return true; },
          },
          {
            title: 'Stock Journal',
            route: '/app/other-entries/stock-journal',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'stock-journal-register',
            hasPermission: () => { return true; },
          },
          {
            title: 'Manufacturing',
            route: '/app/item/manufacturing',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'manufactured-register',
            hasPermission: () => { return true; },
          },
        ]
      },
      {
        title: 'Report',
        color:'yellow',
        faIcon: 'fa-solid fa-clipboard-list',
        base: 'reports',
        showSubRoute: false,
        hasPermission: () => { return true; },
        menu: [
          {
            title: 'Accounts Reports',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'accounts-reports',
            showSubRoute: false,
            hasPermission: () => { return true; },
            menu: [
              {
                title: 'Day Book',
                route: '/app/report/day-book',
                base: 'day-book',
                hasPermission: () => { return true; },
              },
              {
                title: 'Purchase Register',
                route: '/app/report/purchase',
                base: 'purchase-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Sales Register',
                route: '/app/report/sale',
                base: 'sale-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Payment Register',
                route: '/app/report/payment-register',
                base: 'payment-register',
                hasPermission: () => { return true; },
              },
              {
                title: 'Receipt Register',
                route: '/app/report/receipt-register',
                base: 'receipt-register',
                hasPermission: () => { return true; },
              },
              {
                title: 'Journal Register',
                route: '/app/report/journal',
                base: 'journal-register',
                hasPermission: () => { return true; },
              },
              {
                title: 'Cash Register',
                route: '/app/report/cash-book',
                base: 'cash-book',
                hasPermission: () => { return true; },
              },
              {
                title: 'Bank Register',
                route: '/app/report/bank-book',
                base: 'bank-book',
                hasPermission: () => { return true; },
              },
              {
                title: 'Bank Reconcilation',
                route: '/app/report/bank-reconciliation',
                base: 'bank-reconciliation',
                hasPermission: () => { return true; },
              },
              {
                title: 'Ledger',
                route: '/app/report/ledger',
                base: 'ledgers',
                hasPermission: () => { return true; },
              },
            ]
          },
          {
            title: 'Outstanding Reports',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'outstanding-reports',
            hasPermission: () => { return true; },
            menu: [
              {
                title: 'Payable',
                route: '/app/report/payable',
                base: 'payable',
                hasPermission: () => { return true; },
              },
              {
                title: 'Receivable',
                route: '/app/report/receivable',
                base: 'receivable',
                hasPermission: () => { return true; },
              },
              {
                title: 'Group Wise',
                route: '/app/report/group',
                base: 'group-wise',
                hasPermission: () => { return true; },
              },
              {
                title: 'Party Wise',
                route: '/app/report/party',
                base: 'party-wise',
                hasPermission: () => { return true; },
              },
              {
                title: 'Follow Up Remark',
                route: '/app/report/follow-up',
                base: 'follow-up-remark',
                hasPermission: () => { return true; },
              },
            ]
          },
          {
            title: 'Financial Reports',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'financial-reports',
            hasPermission: () => { return true; },
            menu: [
              {
                title: 'Trial Balance',
                route: '/app/report/trial-balance',
                base: 'trial-balance-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Profit & Loss',
                route: '/app/report/profit-and-loss',
                base: 'pnl-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Income & Expenditure',
                route: '/app/report/income-and-expenditure',
                base: 'incomce-expenditure-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Balance Sheet',
                route: '/app/report/balance-sheet',
                base: 'balance-sheet-report',
                hasPermission: () => { return true; },
              },
            ]
          },
          {
            title: 'Stock Reports',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'stock-reports',
            hasPermission: () => { return true; },
            menu: [
              {
                title: 'Stock Summary',
                route: '/app/report/stock-summary',
                base: 'stock-summary',
                hasPermission: () => { return true; },
              },
              {
                title: 'Group Summary',
                route: '/app/report/group-summary',
                base: 'group-summary',
                hasPermission: () => { return true; },
              },
              {
                title: 'Warehouse Summary',
                route: '/app/report/warehouse-summary',
                base: 'warehouse-summary',
                hasPermission: () => { return true; },
              },
              {
                title: 'Item Wise Detail',
                route: '/app/report/item-wise-movement',
                base: 'item-wise-movement',
                hasPermission: () => { return true; },
              },
              {
                title: 'Item Wise Ageing',
                route: '/app/report/item-wise-ageing',
                base: 'item-wise-aging',
                hasPermission: () => { return true; },
              },
              {
                title: 'Expired Product',
                route: '/app/report/expired-product',
                base: 'expired-product',
                hasPermission: () => { return true; },
              },
              {
                title: 'Total Sale Order',
                route: '/app/report/sale-order',
                base: 'sale-order-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Pending Sale Order',
                route: '/app/report/pending-sale-order',
                base: 'pending-sale-order',
                hasPermission: () => { return true; },
              },
              {
                title: 'Total Purchase Order',
                route: '/app/report/purchase-order',
                base: 'purchase-order',
                hasPermission: () => { return true; },
              },
              {
                title: 'Pending Purchase Order',
                route: '/app/report/pending-purchase-order',
                base: 'pending-purchase-order',
                hasPermission: () => { return true; },
              },
              {
                title: 'Stock Journal Register',
                route: '/app/report/stock-journal',
                base: 'stock-journal-register',
                hasPermission: () => { return true; },
              },
              {
                title: 'Manufacturing Register',
                route: '/app/report/manufacture',
                base: 'manufactured-register',
                hasPermission: () => { return true; },
              },
            ]
          },
          {
            title: 'Statutory Reports',
            // icon: 'fa-solid fa-group-arrows-rotate',
            base: 'statutory-reports',
            hasPermission: () => { return true; },
            menu: [
              {
                title: 'GSTR 1',
                 route: '/app/report/gst-R1',
                base: 'gst-R1',
                hasPermission: () => { return true; },
              },
              {
                title: 'GSTR 2',
                route: '/app/report/gst-R2',
                base: 'gst-R2',
                hasPermission: () => { return true; },
              },
              {
                title: 'TDS Reports',
                route: '/app/report/tds',
                base: 'tds-report',
                hasPermission: () => { return true; },
              },
              {
                title: 'Log History',
                route: '/app/report/log-history',
                base: 'log-history',
                hasPermission: () => { return true; },
              },
            ]
          },
        ]
      },
      {
        title: 'Settings',
        color:'#b9b6b6',
        faIcon: 'fa-solid fa-gears',
        showSubRoute: false,
        base: 'company-setting',
        route: '/app/company/setting',
        hasPermission: () => { return true; },
      },
      {
        title: 'Users & Password',
         color:'#a1a1f7',
        faIcon: 'fa-solid fa-user-gear',
        base: 'user-setting',
        route: '/app/users/add',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Import & Export',
         color:'darkcyan',
        faIcon: 'fa-solid fa-file-code',
        base: 'import-export',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Import & Export (From Excel)',
         color:'darkcyan',
        faIcon: 'fa-solid fa-file-code',
        base: 'import-export-excel',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Split & Merge',
         color:'#ed8a8a',
        faIcon: 'fa-regular fa-object-ungroup',
        base: 'split-merge',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Company',
         color:'#cbf788',
        faIcon: 'fa-solid fa-building',
        base: 'company-details',
        route: '/app/company',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Profile',
         color:'#fbcd95',
        faIcon: 'fa-solid fa-user',
        base: 'profile',
        route: '/app/users/profile',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
      {
        title: 'Logout',
         color:'rgb(251 41 14)',
        faIcon: 'fa-solid fa-right-from-bracket',
        base: 'logout',
        showSubRoute: false,
        hasPermission: () => { return true; },
      },
    ]
  }

  public handleDrawerItemClick(drawerItem: any, menuItemType: string): void {
    if (menuItemType == 'mainMenuItem') {
      if (drawerItem.menu) {
        this.side_bar_data.forEach(mainMenu => {
          if (mainMenu.title == drawerItem.title) {
            mainMenu.showSubRoute = !mainMenu.showSubRoute;
          } else {
            mainMenu.showSubRoute = false;
          }
        })
      } else {
        this.side_bar_data.forEach(mainMenu => {
          mainMenu.showSubRoute = false;
          if (mainMenu.menu) {
            mainMenu.menu.forEach((submenu: any) => {
              submenu.showSubRoute = false;
            });
          }
        });
        this.base = drawerItem.base;
        this.currentRoute = drawerItem.route;
        this.activeSubSubmenu = '';
      }
    } else if (menuItemType == 'subMenuItem') {
      this.side_bar_data.forEach(mainMenu => {
        if (mainMenu.menu) {
          mainMenu.menu.forEach((subMenu: any) => {
            if (subMenu.title == drawerItem.title) {
              if (subMenu.menu) {
                subMenu.showSubRoute = !subMenu.showSubRoute;
              } else {
                this.base = mainMenu.base;
                this.currentRoute = subMenu.route;
                this.activeSubSubmenu = '';
              }
            } else {
              subMenu.showSubRoute = false;
            }
          });
        }
      })
    } else {
      this.side_bar_data.forEach(mainMenu => {
        if (mainMenu.menu) {
          mainMenu.menu.forEach((subMenu: any) => {
            if (subMenu.menu) {
              subMenu.menu.forEach((subMenuMenuItem: any) => {
                if (subMenuMenuItem.title == drawerItem.title) {
                  this.base = mainMenu.base;
                  this.currentRoute = subMenuMenuItem.route;
                  this.activeSubSubmenu = subMenu.base;
                }
              });
            }
          });
        }
      })
    }
  }

  logOut() {
    localStorage.clear()
    this.appStateService.sendEvent(AppEvents.LoggedIn, false);
    this.router.navigateByUrl('login');
  }

   openModal() {
    let dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type:'split'
      }
    });

    // dialogRef.componentInstance.confirmed.subscribe(res => {
    //   if (res) {
    //     this.loadCompany('add');
    //     dialogRef.close(true);
    //   }
    // });
  }

  openBarcodeModal(type:string) { 
    let dialogRef = this.dialog.open(GenerateBarcodeComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type:type
      }
    });
  }

  openImportAndExport(type: string) { 
    console.log(type);
    
    if (type=='excel') {
      let dialogRef = this.dialog.open(ImportDataModalComponent, {
        width: '50%',
        autoFocus: false,
      });
    } else {
      let dialogRef = this.dialog.open(ImportExportModalComponent, {
        width: '30%',
        autoFocus: false,
      });
    }
  }

  public navigateAuth(menuValue: string): void {
    //navigate to login page once authenticated
    if (menuValue == 'Authentication') localStorage.removeItem('authenticated');
  }

  hasPermission(moduleName: string, permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, moduleName, permissionValue);
  }

  showLetter() {
    if (this.isMiniSidebar && (this.currentUser?.companyLogoUrl === undefined ||
      this.currentUser?.companyLogoUrl === null || this.currentUser?.companyLogoUrl.length === 0))
      return true;
    else
      return false;
  }

  getFirstCompanyLetter() {
    if (this.currentUser?.companyName?.length > 0) {
      return this.currentUser.companyName.substring(0, 1).toUpperCase();
    } else {
      return '';
    }
  }

  toggleSubmenus() {
    this.side_bar_data.forEach(mainMenu => {
      if (mainMenu.menu) {
        mainMenu.showSubRoute = !this.expandAll;
        mainMenu.menu.forEach((x: any) => {
          if (x.menu) {
            x.showSubRoute = !this.expandAll;
          }
        });
      }
    })
    this.expandAll = !this.expandAll;
  }
}
