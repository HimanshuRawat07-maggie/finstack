import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPartyComponent } from './add-party/add-party.component';
import { PartyDashboardComponent } from './party-dashboard/party-dashboard.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';

const routes: Routes = [
  {
    path: 'add-party',
    component: AddPartyComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Party,
      value: Constants.Add
    }
  },
  {
    path: 'edit-party/:id',
    component: AddPartyComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Party,
      value: Constants.Edit
    }
  },
  {
    path: 'add-party/:caller',
    component: AddPartyComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Party,
      value: Constants.Add
    }
  },
  {
    path: 'dashboard',
    component: PartyDashboardComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Party,
      value: Constants.View
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule { }
