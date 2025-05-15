import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AssetRoutingModule } from './asset-routing.module';
import { BankComponent } from './bank/bank.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BankComponent,
    AddBankComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AssetRoutingModule,
    SharedModule
  ]
})
export class AssetModule { }
