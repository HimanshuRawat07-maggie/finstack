import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ItemRoutingModule } from './item-routing.module';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';
import { FormsModule } from '@angular/forms';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';
import { ItemDashboardComponent } from './item-dashboard/item-dashboard.component';
import { ItemGroupComponent } from './item-group/item-group.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LinkItemGroupComponent } from './link-item-group/link-item-group.component';
import { AddStockBatchComponent } from './add-stock-batch/add-stock-batch.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AddWarehouseComponent } from './add-warehouse/add-warehouse.component';
import { ManufactureItemComponent } from './manufacture-item/manufacture-item.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { TransactionModalComponent } from './transaction-modal/transaction-modal.component';
import { PriceListComponent } from './price-list/price-list.component';
import { GenerateBarcodeComponent } from './generate-barcode/generate-barcode.component';
import { ChangePriceModalComponent } from './change-price-modal/change-price-modal.component';
import { BarcodePrintComponent } from './barcode-print/barcode-print.component';
import { BarcodePrintModalComponent } from './barcode-print-modal/barcode-print-modal.component';


@NgModule({
  declarations: [
    AddEditItemComponent,
    AddCategoryModalComponent,
    ItemDashboardComponent,
    ItemGroupComponent,
    LinkItemGroupComponent,
    AddStockBatchComponent,
    WarehouseComponent,
    AddWarehouseComponent,
    ManufactureItemComponent,
    ManufacturingComponent,
    TransactionModalComponent,
    PriceListComponent,
    GenerateBarcodeComponent,
    ChangePriceModalComponent,
    BarcodePrintComponent,
    BarcodePrintModalComponent
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    DatePipe
  ]
})
export class ItemModule { }
