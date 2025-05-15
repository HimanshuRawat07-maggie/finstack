import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';
import { ItemDashboardComponent } from './item-dashboard/item-dashboard.component';
import { ItemGroupComponent } from './item-group/item-group.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ManufactureItemComponent } from './manufacture-item/manufacture-item.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PriceListComponent } from './price-list/price-list.component';
import { BarcodePrintComponent } from './barcode-print/barcode-print.component';

const routes: Routes = [
  {
    path: 'add-item',
    component: AddEditItemComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Item,
      value: Constants.Add
    }
  },
  {
    path: 'barcode-print',
    component: BarcodePrintComponent,
    canActivate: [PageAccessGuard],
    // data: {
    //   module: ModuleConstants.Item,
    //   value: Constants.Add
    // }
  },
  {
    path: 'price-list',
    component: PriceListComponent,
    canActivate: [PageAccessGuard],
    data: {
      // module: ModuleConstants.Item,
      // value: Constants.Add
    }
  },
  {
    path: 'group',
    component: ItemGroupComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.ItemGroup,
      value: Constants.View
    }
  },
  {
    path: 'edit-item/:id',
    component: AddEditItemComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Item,
      value: Constants.Edit
    }
  },
  {
    path: 'dashboard',
    component: ItemDashboardComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Item,
      value: Constants.View
    }
  },
  {
    path: 'manufacturing',
    component: ManufacturingComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Item,
      value: Constants.View
    }
  },
  {
    path: 'warehouse',
    component: WarehouseComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Warehouse,
      value: Constants.View
    }
  },
  {
    path: 'manufacture/:id',
    component: ManufactureItemComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
