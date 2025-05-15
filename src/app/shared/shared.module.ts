import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { NgxBootstrapModule } from './ngx-bootstrap/ngx-bootstrap.module';
import { SalePurchaseTemplateComponent } from '../feature/shared/sale-purchase-template/sale-purchase-template.component';
import { ClickOutsideDirective } from '../core/directives/click-outside.directive';
import { SalePurchaseBatchModelComponent } from '../feature/shared/sale-purchase-batch-model/sale-purchase-batch-model.component';
import { GridComponent } from '../feature/shared/grid/grid.component';
import { DateFilterComponent } from '../feature/shared/date-filter/date-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DispatchExportDetailsModalComponent } from '../feature/shared/dispatch-export-details-modal/dispatch-export-details-modal.component';

@NgModule({
    declarations: [
        SalePurchaseTemplateComponent,
        SalePurchaseBatchModelComponent,
        ClickOutsideDirective,
        GridComponent,
        DateFilterComponent,
        DispatchExportDetailsModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        MaterialModule,
        NgxBootstrapModule,
        NgSelectModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        MaterialModule,
        NgxBootstrapModule,
        SalePurchaseTemplateComponent,
        GridComponent,
        DateFilterComponent,
        ClickOutsideDirective
    ],
    providers: [DatePipe],
})
export class SharedModule { }
