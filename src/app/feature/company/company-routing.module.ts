import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
import { CompanyChangeComponent } from './company-change/company-change.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';


const routes: Routes = [
    {
        path: '',
        component: CompanyDetailsComponent,
        canActivate: [PageAccessGuard],
        data: {
            module: ModuleConstants.Company,
            value: Constants.View
        }
    },
    {
        path: 'setting',
        component: CompanySettingComponent,
        canActivate: [PageAccessGuard],
        data: {
            module: ModuleConstants.CompanySettings,
            value: Constants.View
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }