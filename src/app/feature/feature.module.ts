import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FeatureRoutingModule } from './feature-routing.module';
import { ApplicationComponent } from './application.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { SharedModule } from '../shared/shared.module';
import { DeleteCompanyComponent } from './shared/delete-company/delete-company.component';
import { PdfModalComponent } from './shared/pdf-modal/pdf-modal.component';
import { SubscriptionModalComponent } from './shared/subscription-modal/subscription-modal.component';
import { SidebarV2Component } from './shared/sidebar-v2/sidebar-v2.component';
import { SubscribeModalComponent } from './shared/subscribe-modal/subscribe-modal.component';
import { ImportExportModalComponent } from './shared/import-export-modal/import-export-modal.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    HeaderComponent,
    SidebarComponent,
    ConfirmationDialogComponent,
    LoaderComponent,
    DeleteCompanyComponent,
    PdfModalComponent,
    SubscriptionModalComponent,
    SidebarV2Component,
    SubscribeModalComponent,
    ImportExportModalComponent
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    MatMenuModule,
    MatExpansionModule,
    SharedModule
  ]
})
export class FeatureModule { }
