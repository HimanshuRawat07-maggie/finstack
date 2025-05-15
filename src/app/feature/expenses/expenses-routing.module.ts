import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LedgerComponent } from './ledgers/ledgers.component';
import { GroupsComponent } from './groups/groups.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';

const routes: Routes = [
  {
    path: 'ledger',
    component: LedgerComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Ledger,
      value: Constants.View
    }
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.MasterGroup,
      value: Constants.View
    }
  },
  {
    path: 'group/create',
    component: AddGroupComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.MasterGroup,
      value: Constants.Add
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
