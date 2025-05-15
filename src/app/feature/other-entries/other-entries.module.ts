import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtherEntriesRoutingModule } from './other-entries-routing.module';
import { StockJournalComponent } from './stock-journal/stock-journal.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StockJournalComponent
  ],
  imports: [
    CommonModule,
    OtherEntriesRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class OtherEntriesModule { }
