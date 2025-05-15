import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaymentOutComponent } from '../other-entries/add-payment-out/add-payment-out.component';
import { PurchaseBillsComponent } from './purchase-bills/purchase-bills.component';
import { PaymentOutComponent } from '../other-entries/payment-out/payment-out.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { CreatePurchaseReturnComponent } from './create-purchase-return/create-purchase-return.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { ChallanInDashboardComponent } from './challan-in-dashboard/challan-in-dashboard.component';
import { CreateChallanInComponent } from './create-challan-in/create-challan-in.component';
import { PurchaseAssetComponent } from './purchase-asset/purchase-asset.component';
import { CreatePurchaseAssetComponent } from './create-purchase-asset/create-purchase-asset.component';

const routes: Routes = [
  {
    path: 'order',
    component: PurchaseOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseOrder,
      value: Constants.View
    }
  },
  {
    path: 'return',
    component: PurchaseReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.DebitNote,
      value: Constants.View
    }
  },
  {
    path: 'bills',
    component: PurchaseBillsComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseBills,
      value: Constants.View
    }
  },
  {
    path: 'order/create',
    component: CreatePurchaseOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseOrder,
      value: Constants.Add
    }
  },
  {
    path: 'challan-in',
    component: ChallanInDashboardComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanIn,
      value: Constants.View
    }
  },
  {
    path: 'challan-in/create',
    component: CreateChallanInComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanIn,
      value: Constants.Add
    }
  },
  {
    path: 'challan-in/edit/:id',
    component: CreateChallanInComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ChallanIn,
      value: Constants.Add
    }
  },
  {
    path: 'assets',
    component: PurchaseAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseAssets,
      value: Constants.View
    }
  },
  {
    path: 'assets/create',
    component: CreatePurchaseAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseAssets,
      value: Constants.Add
    }
  },
  {
    path: 'assets/edit/:id',
    component: CreatePurchaseAssetComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseAssets,
      value: Constants.Edit
    }
  },
  {
    path: 'order/edit/:id',
    component: CreatePurchaseOrderComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseOrder,
      value: Constants.Edit
    }
  },
  {
    path: 'bills/:type',
    component: CreatePurchaseComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseBills,
      value: Constants.Add
    }
  },
  {
    path: 'bills/:type/:id',
    component: CreatePurchaseComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PurchaseBills,
      value: Constants.Edit
    }
  },
  {
    path: 'debit-note/:type',
    component: CreatePurchaseReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.DebitNote,
      value: Constants.Add
    }
  },
  {
    path: 'debit-note/:type/:id',
    component: CreatePurchaseReturnComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.DebitNote,
      value: Constants.Edit
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
