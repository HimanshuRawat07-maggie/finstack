import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { AddLedgerModalComponent } from './add-ledger-modal/add-ledger-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/shared/shared.module';
import { JournalComponent } from '../other-entries/journal/journal.component';
import { AddJournalComponent } from '../other-entries/add-journal/add-journal.component';
import { LedgerComponent } from './ledgers/ledgers.component';
import { GroupsComponent } from './groups/groups.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    LedgerComponent,
    AddLedgerModalComponent,
    JournalComponent,
    AddJournalComponent,
    GroupsComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    FormsModule,
    MatMenuModule,
    SharedModule,
    NgSelectModule
  ]
})
export class ExpensesModule { }
