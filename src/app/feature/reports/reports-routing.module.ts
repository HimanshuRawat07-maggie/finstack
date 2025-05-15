import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentRegisterComponent } from './payment-register/payment-register.component';
import { DayBookComponent } from './day-book/day-book.component';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { BankBookComponent } from './bank-book/bank-book.component';
import { JournalReportComponent } from './journal-report/journal-report.component';
import { ReceiptRegisterComponent } from './receipt-register/receipt-register.component';
import { PayableReportComponent } from './payable-report/payable-report.component';
import { ReceiableReportComponent } from './receiable-report/receiable-report.component';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';
import { SaleOrderReportComponent } from './sale-order-report/sale-order-report.component';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { PendingSaleOrderComponent } from './pending-sale-order/pending-sale-order.component';
import { PendingPurchaseOrderComponent } from './pending-purchase-order/pending-purchase-order.component';
import { ManufacturedProductReportComponent } from './manufactured-product-report/manufactured-product-report.component';
import { GroupSummaryReportComponent } from './group-summary-report/group-summary-report.component';
import { ExpiredProductComponent } from './expired-product/expired-product.component';
import { WarehouseSummaryReportComponent } from './warehouse-summary-report/warehouse-summary-report.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { FollowUpRemarkReportComponent } from './follow-up-remark-report/follow-up-remark-report.component';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';
import { ItemWiseMovementComponent } from './item-wise-movement/item-wise-movement.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { LedgerWiseReportComponent } from './ledger-wise-report/ledger-wise-report.component';
import { IncomeExpenditureComponent } from './income-expenditure/income-expenditure.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { PartyWiseComponent } from './party-wise/party-wise.component';
import { GroupWiseComponent } from './group-wise/group-wise.component';
import { ItemWiseAgeingComponent } from './item-wise-ageing/item-wise-ageing.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { StockJournalReportComponent } from './stock-journal-report/stock-journal-report.component';
import { LogHistoryReportComponent } from './log-history-report/log-history-report.component';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { GstROneComponent } from './gst-r-one/gst-r-one.component';
import { GstRTwoComponent } from './gst-r-two/gst-r-two.component';
import { TdsReportComponent } from './tds-report/tds-report.component';

const routes: Routes = [
  {
    path: 'payment-register',
    component: PaymentRegisterComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'day-book',
    component: DayBookComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'cash-book',
    component: CashBookComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'sale',
    component: SaleReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'purchase',
    component: PurchaseReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'bank-book',
    component: BankBookComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
   {
    path: 'gst-R1',
    component: GstROneComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StatutoryReport,
      value: Constants.View
    }
  },
  {
    path: 'gst-R2',
    component: GstRTwoComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StatutoryReport,
      value: Constants.View
    }
  },
  {
    path: 'follow-up',
    component: FollowUpRemarkReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.OutstandingManagementReport,
      value: Constants.View
    }
  },
    {
    path: 'tds',
    component: TdsReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StatutoryReport,
      value: Constants.View
    }
  },
  {
    path: 'bank-reconciliation',
    component: BankReconciliationComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'journal',
    component: JournalReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'receipt-register',
    component: ReceiptRegisterComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'payable',
    component: PayableReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.OutstandingManagementReport,
      value: Constants.View
    }
  },
  {
    path: 'receivable',
    component: ReceiableReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.OutstandingManagementReport,
      value: Constants.View
    }
  },
  {
    path: 'stock-summary',
    component: StockSummaryComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'sale-order',
    component: SaleOrderReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'pending-sale-order',
    component: PendingSaleOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'purchase-order',
    component: PurchaseOrderReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'pending-purchase-order',
    component: PendingPurchaseOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'manufacture',
    component: ManufacturedProductReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'group-summary',
    component: GroupSummaryReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'warehouse-summary',
    component: WarehouseSummaryReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'expired-product',
    component: ExpiredProductComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'item-wise-movement',
    component: ItemWiseMovementComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'trial-balance',
    component: TrialBalanceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.FinancialStatementsReport,
      value: Constants.View
    }
  },
  {
    path: 'profit-and-loss',
    component: ProfitLossComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.FinancialStatementsReport,
      value: Constants.View
    }
  },
  {
    path: 'ledger',
    component: LedgerWiseReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: ':type/:id',
    component: LedgerWiseReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.AccountsReport,
      value: Constants.View
    }
  },
  {
    path: 'income-and-expenditure',
    component: IncomeExpenditureComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.FinancialStatementsReport,
      value: Constants.View
    }
  },
  {
    path: 'balance-sheet',
    component: BalanceSheetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.FinancialStatementsReport,
      value: Constants.View
    }
  },
  {
    path: 'party',
    component: PartyWiseComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.OutstandingManagementReport,
      value: Constants.View
    }
  },
  {
    path: 'group',
    component: GroupWiseComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.OutstandingManagementReport,
      value: Constants.View
    }
  },
  {
    path: 'item-wise-ageing',
    component: ItemWiseAgeingComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  },
  {
    path: 'log-history',
    component: LogHistoryReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StatutoryReport,
      value: Constants.View
    }
  },
  {
    path: 'stock-journal',
    component: StockJournalReportComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.StockReport,
      value: Constants.View
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
