import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddUser, getUser } from 'src/app/core/api-models/company-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { UserPermissionComponent } from '../user-permission/user-permission.component';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { CurrencyPipe } from '@angular/common';
import { fromEvent } from 'rxjs';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AddUserOrCaModalComponent } from '../add-user-or-ca-modal/add-user-or-ca-modal.component';
import { ActivatedRoute } from '@angular/router';
declare function initPayment(key: string, env: string): any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [CurrencyPipe]
})
export class AddUserComponent implements OnInit {
  userRole: string = '';

  tableData: getUser[];
  constructor(private companyService: CompanyService, private toastr: ToastrService, private dialog: MatDialog, private currencyPipe: CurrencyPipe,
    private userService: UserService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.companyService.getUsers().subscribe(res => {
      this.tableData = res.data;
        this.tableData=this.tableData.filter(x=>x.companyRole!='CA')
      sub.unsubscribe();
    });
  }

  openModal(id: number) {
    this.dialog.open(UserPermissionComponent, {
      width: '80%',
      data: {
        id: id
      },
    });
  }

  addUserOrCaModal(type: string) {
    let dialogRef = this.dialog.open(AddUserOrCaModalComponent, {
      autoFocus: false,
      width: '50%',
      data: {
        type: type
      },
    });
    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
        dialogRef.close(true)
      }
    });
  }

  deleteUser(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected User?',
        title: 'Delete User'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.companyService.deleteUser(id!).subscribe(response => {
          if (response.code == 200) {
            this.loadTableData();
          } else {
            this.toastr.error(response.message);
          }
          dialogRef.close(true);
        });
      }
    });
  }
}
