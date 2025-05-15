import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartyRoutingModule } from './party-routing.module';
import { AddPartyComponent } from './add-party/add-party.component';
import { PartyDashboardComponent } from './party-dashboard/party-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddPartyComponent,
    PartyDashboardComponent,
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class PartyModule { }
