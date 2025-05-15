import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { PageAccessGuard } from 'src/app/core/guards/page-access.guard';
import { ProfileComponent } from './profile/profile.component';
import { CaComponent } from './ca/ca.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddUserComponent,
    canActivate: [PageAccessGuard],
    data: {
      // module: ModuleConstants.Company,
      // value: Constants.View
    }
  },
  {
    path: 'ca',
    component: CaComponent,
    canActivate: [PageAccessGuard],
    data: {
      // module: ModuleConstants.Company,
      // value: Constants.View
    }
  },
   {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [PageAccessGuard],
    data: {
      // module: ModuleConstants.Company,
      // value: Constants.View
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
