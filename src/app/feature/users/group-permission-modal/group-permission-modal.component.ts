import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/core/api-models/expense-model';
import { PermissionValue, UserPermissions } from 'src/app/core/api-models/permission-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-group-permission-modal',
  templateUrl: './group-permission-modal.component.html',
  styleUrls: ['./group-permission-modal.component.scss']
})
export class GroupPermissionModalComponent implements OnInit {
  groups: Array<Group> = [];
  permissions: any;
  userPermissions: any = [
    {
      userId: null,
      permissions: {}
    }
  ]


  constructor(public dialogRef: MatDialogRef<GroupPermissionModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number, },
    private expenseService: ExpenseService, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    const sub = this.expenseService.getGroups().subscribe(res => {
      this.groups = res.data;
      for (let i = 0; i < this.groups.length; i++) {
        this.permissions.push(
          {
            key: this.groups[i].name,
            value: {}
          }
        )
      }
      sub.unsubscribe();
    });
    const perm = this.userService.getUserGroupPermission(this.details.id).subscribe(res => {
      this.permissions = res.data.permissions;
      // this.userGroupPermission = res.data;
      // this.permissions.forEach(permission => {
      //   if (this.userGroupPermission.permissions[permission] === undefined || this.userGroupPermission.permissions[permission] === null) {
      //     this.userGroupPermission.permissions[permission] = {};
      //   }
      // });

      this.groups.forEach(group => {
        if (this.permissions[group.name] === undefined || this.permissions[group.name] === null) {
          this.permissions[group.name] = {}
        }
      })
      perm.unsubscribe();
    });
  }

  selectAll(value: any) {
    this.groups.forEach(group => {
      this.permissions[group.name].canView = value;
      this.permissions[group.name].canCreate = value;
      this.permissions[group.name].canEdit = value;
      this.permissions[group.name].canDelete = value;
    });
  }


  selectAllForModule(groupName: string, value: any) {
    this.permissions[groupName].canView = value;
    this.permissions[groupName].canCreate = value;
    this.permissions[groupName].canEdit = value;
    this.permissions[groupName].canDelete = value;
  }

  cancel() {
    this.dialogRef.close()
  }

  save() {
    this.userPermissions = [{
      userId: this.details.id,
      permissions: this.permissions
    }];

    const sub = this.userService.postUserGroupPermissions(this.userPermissions).subscribe(res => {
      if (res.code == 200) {
        this.cancel();
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }
}
