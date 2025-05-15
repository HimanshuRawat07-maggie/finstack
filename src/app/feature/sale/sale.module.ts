import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { AddPaymentInComponent } from '../other-entries/add-payment-in/add-payment-in.component';
import { CreateSaleOrderComponent } from './create-sale-order/create-sale-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentInComponent } from '../other-entries/payment-in/payment-in.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { CreateSaleReturnComponent } from './create-sale-return/create-sale-return.component';
import { LinkPaymentComponent } from './link-payment/link-payment.component';
import { TaxInvoiceComponent } from './tax-invoice/tax-invoice.component';
import { PosInvoiceComponent } from './pos-invoice/pos-invoice.component';
import { ServiceInvoiceComponent } from './service-invoice/service-invoice.component';
import { CreateTaxInvoiceComponent } from './create-tax-invoice/create-tax-invoice.component';
import { CreatePosInvoiceComponent } from './create-pos-invoice/create-pos-invoice.component';
import { CreateServiceInvoiceComponent } from './create-service-invoice/create-service-invoice.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EWayBillModalComponent } from './e-way-bill-modal/e-way-bill-modal.component';
import { CreateChallanOutComponent } from './create-challan-out/create-challan-out.component';
import { ChallanOutDashboardComponent } from './challan-out-dashboard/challan-out-dashboard.component';
import { SaleAssetComponent } from './sale-asset/sale-asset.component';
import { CreateSaleAssetComponent } from './create-sale-asset/create-sale-asset.component';
import { ExportInvoiceComponent } from './export-invoice/export-invoice.component';
import { CreateExportInvoiceComponent } from './create-export-invoice/create-export-invoice.component';
import { CancelEinvoiceComponent } from './cancel-einvoice/cancel-einvoice.component';


@NgModule({
  declarations: [
    AddPaymentInComponent,
    CreateSaleOrderComponent,
    PaymentInComponent,
    SaleInvoiceComponent,
    SaleOrderComponent,
    SaleReturnComponent,
    CreateSaleComponent,
    CreateSaleReturnComponent,
    LinkPaymentComponent,
    TaxInvoiceComponent,
    PosInvoiceComponent,
    ServiceInvoiceComponent,
    CreateTaxInvoiceComponent,
    CreatePosInvoiceComponent,
    CreateServiceInvoiceComponent,
    EWayBillModalComponent,
    CreateChallanOutComponent,
    ChallanOutDashboardComponent,
    SaleAssetComponent,
    CreateSaleAssetComponent,
    ExportInvoiceComponent,
    CreateExportInvoiceComponent,
    CancelEinvoiceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SaleRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class SaleModule { }
