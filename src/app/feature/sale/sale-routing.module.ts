import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaymentInComponent } from '../other-entries/add-payment-in/add-payment-in.component';
import { CreateSaleOrderComponent } from './create-sale-order/create-sale-order.component';
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
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { ChallanOutDashboardComponent } from './challan-out-dashboard/challan-out-dashboard.component';
import { CreateChallanOutComponent } from './create-challan-out/create-challan-out.component';
import { CreateSaleAssetComponent } from './create-sale-asset/create-sale-asset.component';
import { SaleAssetComponent } from './sale-asset/sale-asset.component';
import { ExportInvoiceComponent } from './export-invoice/export-invoice.component';
import { CreateExportInvoiceComponent } from './create-export-invoice/create-export-invoice.component';

const routes: Routes = [
  {
    path: 'order/create',
    component: CreateSaleOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleOrder,
      value: Constants.Add
    }
  },
  {
    path: 'order/edit/:id',
    component: CreateSaleOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleOrder,
      value: Constants.Edit
    }
  },
  {
    path: 'challan-out/create',
    component: CreateChallanOutComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanOut,
      value: Constants.Add
    }
  },
  {
    path: 'challan-out/edit/:id',
    component: CreateChallanOutComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanOut,
      value: Constants.Edit
    }
  },
  {
    path: 'challan-out',
    component: ChallanOutDashboardComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanOut,
      value: Constants.View
    }
  },
  {
    path: 'assets/create',
    component: CreateSaleAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleAssets,
      value: Constants.Add
    }
  },
    {
    path: 'assets/edit/:id',
    component: CreateSaleAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleAssets,
      value: Constants.Edit
    }
  },
  {
    path: 'assets',
    component: SaleAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleAssets,
      value: Constants.View
    }
  },
  {
    path: 'invoice/:type',
    component: CreateSaleComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Sale,
      value: Constants.Add
    }
  },
  {
    path: 'invoice/:type/:id',
    component: CreateSaleComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Sale,
      value: Constants.Edit
    }
  },
  {
    path: 'tax-invoice/:type',
    component: CreateTaxInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Sale,
      value: Constants.Add
    }
  },
  {
    path: 'tax-invoice/:type/:id',
    component: CreateTaxInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Sale,
      value: Constants.Edit
    }
  },
  {
    path: 'tax-invoice/order/:id',
    component: CreateTaxInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.TaxInvoice,
      value: Constants.Edit
    }
  },
  {
    path: 'service_invoice/create',
    component: CreateServiceInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ServiceInvoice,
      value: Constants.Add
    }
  },
  {
    path: 'service_invoice/edit/:id',
    component: CreateServiceInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ServiceInvoice,
      value: Constants.Edit
    }
  },
  {
    path: 'pos_invoice/create',
    component: CreatePosInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PosInvoice,
      value: Constants.Add
    }
  },
  {
    path: 'export-invoice',
    component: ExportInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ExportInvoice,
      value: Constants.View
    }
  },
  {
    path: 'export-invoice/create',
    component: CreateExportInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ExportInvoice,
      value: Constants.Add
    }
  },
  {
    path: 'export-invoice/edit/:id',
    component: CreateExportInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ExportInvoice,
      value: Constants.Edit
    }
  },
  {
    path: 'pos_invoice/edit/:id',
    component: CreatePosInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PosInvoice,
      value: Constants.Edit
    }
  },
  {
    path: 'credit-note/:type',
    component: CreateSaleReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.CreditNote,
      value: Constants.Add
    }
  },
  {
    path: 'credit-note/:type/:id',
    component: CreateSaleReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.CreditNote,
      value: Constants.Edit
    }
  },
  {
    path: 'invoice',
    component: SaleInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Sale,
      value: Constants.View
    }
  },
  {
    path: 'order',
    component: SaleOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.SaleOrder,
      value: Constants.View
    }
  },
  {
    path: 'return',
    component: SaleReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.CreditNote,
      value: Constants.View
    }
  },
  {
    path: 'tax-invoice',
    component: TaxInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.TaxInvoice,
      value: Constants.View
    }
  },
  {
    path: 'pos-invoice',
    component: PosInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PosInvoice,
      value: Constants.View
    }
  },
  {
    path: 'service-invoice',
    component: ServiceInvoiceComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ServiceInvoice,
      value: Constants.View
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
