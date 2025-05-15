import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { LoggedInGuard } from '../core/guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    component: ApplicationComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'item',
        loadChildren: () => import('./item/item.module').then((m) => m.ItemModule)
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then((m) => m.CompanyModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'party',
        loadChildren: () => import('./party/party.module').then((m) => m.PartyModule)
      },
      {
        path: 'sale',
        loadChildren: () => import('./sale/sale.module').then((m) => m.SaleModule)
      },
      {
        path: 'other-entries',
        loadChildren: () => import('./other-entries/other-entries.module').then((m) => m.OtherEntriesModule)
      },
      {
        path: 'purchase',
        loadChildren: () => import('./purchase/purchase.module').then((m) => m.PurchaseModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule)
      },
      {
        path: 'master',
        loadChildren: () => import('./expenses/expenses.module').then((m) => m.ExpensesModule)
      },
      {
        path: 'asset',
        loadChildren: () => import('./asset/asset.module').then((m) => m.AssetModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
