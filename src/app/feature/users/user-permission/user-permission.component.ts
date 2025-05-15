import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { GroupPermissionModalComponent } from '../group-permission-modal/group-permission-modal.component';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  userRole: string = '';
  userPermission: UserPermissions = {
    userId: 0,
    permissions: {
      'dashboard': {}, 'company': {}, 'item': {}, 'item group': {}, 'warehouse': {}, 'party': {}, 'bank': {}, 'sale order': {},
      'sale invoice': {},'challan out':{},'sale asstes':{}, 'tax invoice': {}, 'pos invoice': {}, 'service invoice': {},'export invoice':{}, 'credit note': {}, 'purchase order': {},
      'purchase bills': {},'challan in':{},'purchase assets':{}, 'debit note': {}, 'payment in': {}, 'payment out': {}, 'journal': {}, 'master group': {},
      'ledger': {}, 'financial statements report': {}, 'accounts report': {}, 'outstanding management report': {},
      'stock report': {}, 'statutory report': {}, 'company settings': {}, 'test': {}
    }
  };
  permissions: Array<string> = BusinessHelpers.permissions;

  //for add permission in new page it have add 4 objects which are UserPermission,BusinessHelpers.permissions and two times in app state servixe

  constructor(public dialogRef: MatDialogRef<UserPermissionComponent>, @Inject(MAT_DIALOG_DATA) public data: { id: number, }, private userService: UserService, private toastr: ToastrService, private dialog: MatDialog) { }
  ngOnInit() {    
    this.userPermission.userId = this.data.id;
    const sub = this.userService.getUserPermission(this.userPermission.userId).subscribe(res => {
      this.userPermission = res.data;
      this.permissions.forEach(permission => {            
        if (this.userPermission.permissions[permission] === undefined || this.userPermission.permissions[permission] === null) {
          this.userPermission.permissions[permission] = {};
        }
      });
      sub.unsubscribe();
    });
  }

  selectAllForModule(permission: string, value: any) {
    this.userPermission.permissions[permission].canView = value;
    this.userPermission.permissions[permission].canCreate = value;
    this.userPermission.permissions[permission].canEdit = value;
    this.userPermission.permissions[permission].canDelete = value;
  }

  selectAll(value: any) {
    this.permissions.forEach(permission => {
      this.userPermission.permissions[permission].canView = value;
      this.userPermission.permissions[permission].canCreate = value;
      this.userPermission.permissions[permission].canEdit = value;
      this.userPermission.permissions[permission].canDelete = value;
    });
  }

  cancel() {
    this.dialogRef.close()
  }

  save() {
    let Array: Array<UserPermissions> = [];
    Array.push(this.userPermission);
    
    const sub = this.userService.postUserPermissions(Array).subscribe(res => {
      if (res.code == 200) {
        this.cancel();
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    })
  }

  openGroupsDialog() {
    let dialogRef = this.dialog.open(GroupPermissionModalComponent, {
      width: '70%',
      autoFocus: false,
      data: {
        id: this.data.id
      },
    });

    // dialogRef.componentInstance.confirmed.subscribe(res => {
    //   if (res) {
    //     // let id: number | undefined = this.data[idx].id;
    //     this.itemService.deleteProduct(idx!).subscribe(response => {
    //       this.loadTableData();
    //       dialogRef.close(true);
    //     });
    //   }
    // });
  }

}
