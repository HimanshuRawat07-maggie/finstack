import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyRoutingModule } from './company-routing.module';
import { FormsModule } from '@angular/forms';
import { AdjustItemDialogComponent } from '../item/adjust-item-dialog/adjust-item-dialog.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyChangeComponent } from './company-change/company-change.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ImportDataModalComponent } from './import-data-modal/import-data-modal.component';
import { GstPortalModalComponent } from './gst-portal-modal/gst-portal-modal.component';


@NgModule({
  declarations: [
    CompanyDetailsComponent,
    AdjustItemDialogComponent,
    CompanySettingComponent,
    CompanyChangeComponent,
    AddCompanyComponent,
    ImportDataModalComponent,
    GstPortalModalComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CompanyModule { }
