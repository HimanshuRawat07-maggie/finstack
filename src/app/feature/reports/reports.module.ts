import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { PaymentRegisterComponent } from './payment-register/payment-register.component';
import { DayBookComponent } from './day-book/day-book.component';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { BankBookComponent } from './bank-book/bank-book.component';
import { SharedModule } from "../../shared/shared.module";
import { JournalReportComponent } from './journal-report/journal-report.component';
import { ReceiptRegisterComponent } from './receipt-register/receipt-register.component';
import { PayableReportComponent } from './payable-report/payable-report.component';
import { ReceiableReportComponent } from './receiable-report/receiable-report.component';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';
import { SaleOrderReportComponent } from './sale-order-report/sale-order-report.component';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { PendingPurchaseOrderComponent } from './pending-purchase-order/pending-purchase-order.component';
import { PendingSaleOrderComponent } from './pending-sale-order/pending-sale-order.component';
import { ManufacturedProductReportComponent } from './manufactured-product-report/manufactured-product-report.component';
import { GroupSummaryReportComponent } from './group-summary-report/group-summary-report.component';
import { ExpiredProductComponent } from './expired-product/expired-product.component';
import { WarehouseSummaryReportComponent } from './warehouse-summary-report/warehouse-summary-report.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { FollowUpRemarkReportComponent } from './follow-up-remark-report/follow-up-remark-report.component';
import { FollowUpModalComponent } from './follow-up-modal/follow-up-modal.component';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';
import { ItemWiseMovementComponent } from './item-wise-movement/item-wise-movement.component';
import { FollowUpHistoryComponent } from './follow-up-history/follow-up-history.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { LedgerWiseReportComponent } from './ledger-wise-report/ledger-wise-report.component';
import { IncomeExpenditureComponent } from './income-expenditure/income-expenditure.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { PartyWiseComponent } from './party-wise/party-wise.component';
import { GroupWiseComponent } from './group-wise/group-wise.component';
import { ItemWiseAgeingComponent } from './item-wise-ageing/item-wise-ageing.component';
import { StockJournalReportComponent } from './stock-journal-report/stock-journal-report.component';
import { LogHistoryReportComponent } from './log-history-report/log-history-report.component';
import { GstROneComponent } from './gst-r-one/gst-r-one.component';
import { GstRTwoComponent } from './gst-r-two/gst-r-two.component';
import { TdsReportComponent } from './tds-report/tds-report.component';


@NgModule({
  declarations: [
    PaymentRegisterComponent,
    DayBookComponent,
    SaleReportComponent,
    PurchaseReportComponent,
    BankBookComponent,
    JournalReportComponent,
    ReceiptRegisterComponent,
    PayableReportComponent,
    ReceiableReportComponent,
    StockSummaryComponent,
    SaleOrderReportComponent,
    PurchaseOrderReportComponent,
    PendingPurchaseOrderComponent,
    PendingSaleOrderComponent,
    ManufacturedProductReportComponent,
    GroupSummaryReportComponent,
    ExpiredProductComponent,
    WarehouseSummaryReportComponent,
    CashBookComponent,
    FollowUpRemarkReportComponent,
    FollowUpModalComponent,
    BankReconciliationComponent,
    ItemWiseMovementComponent,
    FollowUpHistoryComponent,
    TrialBalanceComponent,
    ProfitLossComponent,
    LedgerWiseReportComponent,
    IncomeExpenditureComponent,
    BalanceSheetComponent,
    PartyWiseComponent,
    GroupWiseComponent,
    ItemWiseAgeingComponent,
    StockJournalReportComponent,
    LogHistoryReportComponent,
    GstROneComponent,
    GstRTwoComponent,
    TdsReportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
