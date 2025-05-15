import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupPermissionModalComponent } from './group-permission-modal/group-permission-modal.component';
import { AddUserOrCaModalComponent } from './add-user-or-ca-modal/add-user-or-ca-modal.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CaComponent } from './ca/ca.component';


@NgModule({
  declarations: [
    AddUserComponent,
    UserPermissionComponent,
    GroupPermissionModalComponent,
    AddUserOrCaModalComponent,
    ProfileComponent,
    ResetPasswordComponent,
    CaComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class UsersModule { }
