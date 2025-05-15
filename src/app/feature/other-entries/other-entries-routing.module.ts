import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentInComponent } from './payment-in/payment-in.component';
import { PaymentOutComponent } from './payment-out/payment-out.component';
import { JournalComponent } from './journal/journal.component';
import { AddJournalComponent } from './add-journal/add-journal.component';
import { AddPaymentOutComponent } from './add-payment-out/add-payment-out.component';
import { AddPaymentInComponent } from './add-payment-in/add-payment-in.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { StockJournalComponent } from './stock-journal/stock-journal.component';

const routes: Routes = [
  {
    path: 'payment-in',
    component: PaymentInComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentIn,
      value: Constants.View
    }
  },
  {
    path: 'stock-journal',
    component: StockJournalComponent,
    canActivate: [PageAccessGuard],
    data: {
      // module: ModuleConstants.PaymentIn,
      // value: Constants.View
    }
  },
  {
    path: 'payment-out',
    component: PaymentOutComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentOut,
      value: Constants.View
    }
  },
  {
    path: 'journal',
    component: JournalComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Journal,
      value: Constants.View
    }
  },
  {
    path: 'journal/create',
    component: AddJournalComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Journal,
      value: Constants.Add
    }
  },
  {
    path: 'journal/edit/:id',
    component: AddJournalComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.Journal,
      value: Constants.Edit
    }
  },
  {
    path: 'add-payment-out',
    component: AddPaymentOutComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentOut,
      value: Constants.Add
    }
  },
  {
    path: 'edit-payment-out/:id',
    component: AddPaymentOutComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentOut,
      value: Constants.Edit
    }
  },
  {
    path: 'add-payment-in',
    component: AddPaymentInComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentIn,
      value: Constants.Add
    }
  },
  {
    path: 'edit-payment-in/:id',
    component: AddPaymentInComponent,
    canActivate: [PageAccessGuard],
    data: {
      module: ModuleConstants.PaymentIn,
      value: Constants.Edit
    }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherEntriesRoutingModule { }
