import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { AddPaymentOutComponent } from '../other-entries/add-payment-out/add-payment-out.component';
import { PurchaseBillsComponent } from './purchase-bills/purchase-bills.component';
import { PaymentOutComponent } from '../other-entries/payment-out/payment-out.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { CreatePurchaseReturnComponent } from './create-purchase-return/create-purchase-return.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChallanInDashboardComponent } from './challan-in-dashboard/challan-in-dashboard.component';
import { CreateChallanInComponent } from './create-challan-in/create-challan-in.component';
import { PurchaseAssetComponent } from './purchase-asset/purchase-asset.component';
import { CreatePurchaseAssetComponent } from './create-purchase-asset/create-purchase-asset.component';


@NgModule({
  declarations: [
    AddPaymentOutComponent,
    PurchaseBillsComponent,
    PaymentOutComponent,
    PurchaseOrderComponent,
    PurchaseReturnComponent,
    CreatePurchaseOrderComponent,
    CreatePurchaseComponent,
    CreatePurchaseReturnComponent,
    ChallanInDashboardComponent,
    CreateChallanInComponent,
    PurchaseAssetComponent,
    CreatePurchaseAssetComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class PurchaseModule { }
