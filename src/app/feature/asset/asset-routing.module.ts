import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank/bank.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';

const routes: Routes = [
  {
    path: 'bank',
    component: BankComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Bank,
      value: Constants.View
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
