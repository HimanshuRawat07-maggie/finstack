import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { CurrentUser } from 'src/app/core/models/user';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

interface SubMenu {
  menuValue: string;
  route?: string;
  base?: string;
  showSubRoute?: boolean;
}

interface MainMenus {
  menu: SubMenu[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
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

  constructor(public router: Router, private appStateService: AppStateService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.appStateService.isMiniSidebar().subscribe(res => { setTimeout(() => { this.isMiniSidebar = res; }, 0) });
    this.appStateService.currentUser().subscribe(res => { this.currentUser = res; });
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.appStateService.getCompanySettings().subscribe(res => {
      this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
      this.isManufactureEnabled = this.authService.isManufacturnigEnabled == 'true';
    });

    this.currentRoute = this.router.url;
    let items: Array<any> = [];
    this.initSidebar();
    this.side_bar_data.forEach(menu => {
      if (menu.hasSubRoute) {
        menu.menu.forEach((submenu: any) => {
          if (submenu.hasSubRoute) {
            if (submenu.subMenus.map((x: any) => x.route).includes(this.currentRoute)) {
              submenu.showSubRoute = true;
            }
            items = [...items, ...submenu.subMenus];
          } else {
            items = [...items, submenu];
          }
        });
      } else {
        items = [...items, ...menu.menu];
      }
    });
    this.base = items.find(x => x.route.startsWith(this.currentRoute))?.base ?? 'dashboard';
  }

  initSidebar() {
    this.side_bar_data = [
      {
        tittle: 'Main',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => { return this.hasPermission(ModuleConstants.Dashboard, this.constants.View) || this.hasPermission(ModuleConstants.Company, this.constants.View); },
        menu: [
          {
            menuValue: 'Dashboard',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-dashboard',
            base: 'dashboard',
            route: '/app/dashboard/',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Dashboard, this.constants.View); }
          },
          {
            menuValue: 'Company',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-building',
            base: 'application',
            route: '/app/company',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Company, this.constants.View); }
          },
        ],
      },
      {
        tittle: 'Account Master',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.Ledger, this.constants.View) ||
            this.hasPermission(ModuleConstants.MasterGroup, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Group',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-group-arrows-rotate',
            base: 'group',
            route: '/app/master/groups',
            hasPermission: () => { return this.hasPermission(ModuleConstants.MasterGroup, this.constants.View); },
          }, {
            menuValue: 'Ledger',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-list',
            base: 'expense-category',
            route: '/app/master/ledger',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Ledger, this.constants.View); },
          }
        ]
      },
      {
        tittle: 'Inventory',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.Item, this.constants.View) ||
            this.hasPermission(ModuleConstants.ItemGroup, this.constants.View) ||
            (this.isWarehouseEnabled && this.hasPermission(ModuleConstants.Warehouse, this.constants.View)));
        },
        menu: [
          {
            menuValue: 'Item / Service',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-box',
            base: 'product-service',
            route: '/app/item/dashboard',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Item, this.constants.View); },
          },
          {
            menuValue: 'Item Group',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-boxes-stacked',
            base: 'inventory',
            route: '/app/item/group',
            hasPermission: () => { return this.hasPermission(ModuleConstants.ItemGroup, this.constants.View); },
          },
          {
            menuValue: 'Warehouse',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-warehouse',
            base: 'Warehouse',
            route: '/app/item/warehouse',
            hasPermission: () => { return this.isWarehouseEnabled && this.hasPermission(ModuleConstants.Warehouse, this.constants.View); },
          },
          {
            menuValue: 'Manufacturing',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-boxes-packing',
            base: 'manufacturing',
            route: '/app/item/manufacturing',
            hasPermission: () => { return this.isManufactureEnabled && this.hasPermission(ModuleConstants.Item, this.constants.View); },
          },

        ],
      },
      {
        tittle: 'Party',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => { return this.hasPermission(ModuleConstants.Party, this.constants.View); },
        menu: [
          {
            menuValue: 'Party(Debtor/Creditor)',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-users',
            base: 'party',
            route: '/app/party/dashboard',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Party, this.constants.View); },
          },
        ],
      },
      {
        tittle: 'Asset',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => { return this.hasPermission(ModuleConstants.Bank, this.constants.View); },
        menu: [
          {
            menuValue: 'Bank',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-building-columns',
            base: 'bank',
            route: '/app/asset/bank',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Bank, this.constants.View); },
          },
        ],
      },
      {
        tittle: 'Sales',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.SaleOrder, this.constants.View) ||
            this.hasPermission(ModuleConstants.Sale, this.constants.View) ||
            this.hasPermission(ModuleConstants.TaxInvoice, this.constants.View) ||
            this.hasPermission(ModuleConstants.PosInvoice, this.constants.View) ||
            this.hasPermission(ModuleConstants.ServiceInvoice, this.constants.View) ||
            this.hasPermission(ModuleConstants.CreditNote, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Sale Order',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-clipboard-list',
            base: 'sale-order',
            route: '/app/sale/order',
            hasPermission: () => { return this.hasPermission(ModuleConstants.SaleOrder, this.constants.View); },
          },
          {
            menuValue: 'Retail Invoices',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-clipboard',
            base: 'sale-invoices',
            route: '/app/sale/invoice',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Sale, this.constants.View); },
          },
          {
            menuValue: 'Tax Invoices',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-receipt',
            base: 'tax-invoices',
            route: '/app/sale/tax-invoice',
            hasPermission: () => { return this.hasPermission(ModuleConstants.TaxInvoice, this.constants.View); },
          },
          {
            menuValue: 'POS Invoices',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-file-invoice',
            base: 'pos-invoices',
            route: '/app/sale/pos-invoice',
            hasPermission: () => { return this.hasPermission(ModuleConstants.PosInvoice, this.constants.View); },
          },
          {
            menuValue: 'Service Invoices',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa-solid fa-bars',
            base: 'service-invoices',
            route: '/app/sale/service-invoice',
            hasPermission: () => { return this.hasPermission(ModuleConstants.ServiceInvoice, this.constants.View); },
          },
          {
            menuValue: 'Credit Note',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-arrow-rotate-left',
            base: 'credit-note',
            route: '/app/sale/return',
            hasPermission: () => { return this.hasPermission(ModuleConstants.CreditNote, this.constants.View); },
          }
        ],
      },
      {
        tittle: 'Purchase',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.PurchaseOrder, this.constants.View) ||
            this.hasPermission(ModuleConstants.PurchaseBills, this.constants.View) ||
            this.hasPermission(ModuleConstants.DebitNote, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Purchase Order',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-clipboard-list',
            base: 'purchase-order',
            route: '/app/purchase/order',
            hasPermission: () => { return this.hasPermission(ModuleConstants.PurchaseOrder, this.constants.View); },
          },
          {
            menuValue: 'Purchase Bills',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-cart-shopping',
            base: 'bills',
            route: '/app/purchase/bills',
            hasPermission: () => { return this.hasPermission(ModuleConstants.PurchaseBills, this.constants.View); },
          },
          {
            menuValue: 'Debit Note',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'fa fa-arrow-rotate-right',
            base: 'debit-note',
            route: '/app/purchase/return',
            hasPermission: () => { return this.hasPermission(ModuleConstants.DebitNote, this.constants.View); },
          }
        ],
      },
      {
        tittle: 'Other Entries',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.PaymentIn, this.constants.View) ||
            this.hasPermission(ModuleConstants.PaymentOut, this.constants.View) ||
            this.hasPermission(ModuleConstants.Journal, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Payment-In',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-money-withdraw',
            base: 'payment-in',
            route: '/app/other-entries/payment-in',
            hasPermission: () => { return this.hasPermission(ModuleConstants.PaymentIn, this.constants.View); },
          },
          {
            menuValue: 'Payment-Out',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-money-insert',
            base: 'payment-out',
            route: '/app/other-entries/payment-out',
            hasPermission: () => { return this.hasPermission(ModuleConstants.PaymentOut, this.constants.View); },
          },
          {
            menuValue: 'Journal',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-diary',
            base: 'journal',
            route: '/app/other-entries/journal',
            hasPermission: () => { return this.hasPermission(ModuleConstants.Journal, this.constants.View); },
          }
        ]
      },
      {
        tittle: 'Reports',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasSubRoute: true,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View) ||
            this.hasPermission(ModuleConstants.AccountsReport, this.constants.View) ||
            this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View) ||
            this.hasPermission(ModuleConstants.StatutoryReport, this.constants.View) ||
            this.hasPermission(ModuleConstants.StockReport, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Financial Statements',
            hasSubRoute: true,
            showSubRoute: false,
            icon: 'uil uil-chart',
            hasPermission: () => { return this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View); },
            subMenus: [
              {
                menuValue: 'Trial Balance',
                hasSubRoute: false,
                showSubRoute: false,
                base: 'trial-balance-report',
                route: '/app/report/trial-balance',
                hasPermission: () => { return this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View); }
              },
              {
                menuValue: 'Profit & Loss',
                hasSubRoute: false,
                showSubRoute: false,
                base: 'pnl-report',
                route: '/app/report/profit-and-loss',
                hasPermission: () => { return this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View); }
              },
              {
                menuValue: 'Income & Expenditure',
                hasSubRoute: false,
                showSubRoute: false,
                base: 'incomce-expenditure-report',
                route: '/app/report/income-and-expenditure',
                hasPermission: () => { return this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View); }
              },
              {
                menuValue: 'Balance Sheet',
                hasSubRoute: false,
                showSubRoute: false,
                base: 'balance-sheet-report',
                route: '/app/report/balance-sheet',
                hasPermission: () => { return this.hasPermission(ModuleConstants.FinancialStatementsReport, this.constants.View); }
              }
            ]
          },
          {
            menuValue: 'Accounts Reports',
            hasSubRoute: true,
            showSubRoute: false,
            icon: 'uil uil-chart-growth',
            hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
            subMenus: [
              {
                menuValue: 'Sale Register',
                hasSubRoute: false,
                showSubRoute: false,
                base: 'sale-report',
                route: '/app/report/sale',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); }
              },
              {
                menuValue: 'Purchase Register',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-bag-shopping',
                base: 'purchase-report',
                route: '/app/report/purchase',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Day Book',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-book',
                base: 'day-book',
                route: '/app/report/day-book',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Cash Book',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-book',
                base: 'cash-book',
                route: '/app/report/cash-book',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Bank Book',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'bank-book',
                route: '/app/report/bank-book',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Payment-In Register',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'receipt-register',
                route: '/app/report/receipt-register',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Payment-Out Register',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'payment-register',
                route: '/app/report/payment-register',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Journal Register',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'journal-register',
                route: '/app/report/journal',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Ledgers',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'ledgers',
                route: '/app/report/ledger',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
              {
                menuValue: 'Bank Reconciliation',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'bank-reconciliation',
                route: '/app/report/bank-reconciliation',
                hasPermission: () => { return this.hasPermission(ModuleConstants.AccountsReport, this.constants.View); },
              },
            ]
          },
          {
            menuValue: 'Outstanding Management',
            hasSubRoute: true,
            showSubRoute: false,
            icon: 'uil uil-chart-line',
            hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
            subMenus: [
              {
                menuValue: 'Payable',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'payable',
                route: '/app/report/payable',
                hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
              },
              {
                menuValue: 'Receivable',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'receiable',
                route: '/app/report/receivable',
                hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
              },
              {
                menuValue: 'Group Wise',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'group-wise',
                route: '/app/report/group',
                hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
              },
              {
                menuValue: 'Party Wise',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'party-wise',
                route: '/app/report/party',
                hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
              },
              {
                menuValue: 'Follow-Up Remark ',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'follow-up',
                route: '/app/report/follow-up',
                hasPermission: () => { return this.hasPermission(ModuleConstants.OutstandingManagementReport, this.constants.View); },
              }]
          },
          {
            menuValue: 'Stock Reports',
            hasSubRoute: true,
            showSubRoute: false,
            icon: 'uil uil-chart-pie-alt',
            hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            subMenus: [{
              menuValue: 'Stock Summary',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'stock-summary',
              route: '/app/report/stock-summary',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Group Summary',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'group-summary',
              route: '/app/report/group-summary',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Warehouse Summary',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'warehouse-summary',
              route: '/app/report/warehouse-summary',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Item Wise Detail',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'item-wise-movement',
              route: '/app/report/item-wise-movement',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Item Wise Ageing',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'item-wise-aging',
              route: '/app/report/item-wise-ageing',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Expired Product',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'expired-product',
              route: '/app/report/expired-product',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Total Sale Order',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'sale-order-report',
              route: '/app/report/sale-order',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Pending Sale Order',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'pending-sale-order',
              route: '/app/report/pending-sale-order',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Total Purchase Order',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'purchase-order',
              route: '/app/report/purchase-order',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Pending Purchase Order',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'pending-purchase-order',
              route: '/app/report/pending-purchase-order',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Stock Journal Register',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'stock-journal-register',
              route: '/app/report/stock-journal',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            {
              menuValue: 'Manufacturing Register',
              hasSubRoute: false,
              showSubRoute: false,
              icon: 'fa-solid fa-border-all',
              base: 'manufactured-register',
              route: '/app/report/manufacture',
              hasPermission: () => { return this.hasPermission(ModuleConstants.StockReport, this.constants.View); },
            },
            ]
          },
          {
            menuValue: 'Statutory Reports',
            hasSubRoute: true,
            showSubRoute: false,
            icon: 'uil uil-file-graph',
            hasPermission: () => { return this.hasPermission(ModuleConstants.StatutoryReport, this.constants.View); },
            subMenus: [
              {
                menuValue: 'Log History',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'log-history',
                route: '/app/report/log-history',
                hasPermission: () => { return this.hasPermission(ModuleConstants.StatutoryReport, this.constants.View); },
              },
              {
                menuValue: 'GST Reports',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'gst-reports',
                route: '/app/report/sale',
                hasPermission: () => { return this.hasPermission(ModuleConstants.StatutoryReport, this.constants.View); },
              },
              {
                menuValue: 'TDS Reports',
                hasSubRoute: false,
                showSubRoute: false,
                icon: 'fa-solid fa-border-all',
                base: 'tds-report',
                route: '/app/report/sale',
                hasPermission: () => { return this.hasPermission(ModuleConstants.StatutoryReport, this.constants.View); },
              },
            ]
          }
        ]
      },
      {
        tittle: 'Settings',
        active: false,
        icon: 'airplay',
        showAsTab: false,
        separateRoute: false,
        hasPermission: () => {
          return (this.hasPermission(ModuleConstants.PaymentIn, this.constants.View) ||
            this.hasPermission(ModuleConstants.PaymentOut, this.constants.View) ||
            this.hasPermission(ModuleConstants.Journal, this.constants.View));
        },
        menu: [
          {
            menuValue: 'Company Settings',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-cog',
            base: 'company-setting',
            route: '/app/company/setting',
            hasPermission: () => { return this.hasPermission(ModuleConstants.CompanySettings, this.constants.View); },
          },
          {
            menuValue: 'User Settings & Permissions',
            hasSubRoute: false,
            showSubRoute: false,
            icon: 'uil uil-users-alt',
            base: 'user-setting',
            route: '/app/users/add',
            hasPermission: () => { return this.currentUser.companyRole === 'COMPANY_ADMIN'; },
          }
        ]
      },
    ]
  }

  public expandSubMenus(menu: any): void {
    // sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MainMenus) => {

      mainMenus.menu.map((resMenu: SubMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
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
}
