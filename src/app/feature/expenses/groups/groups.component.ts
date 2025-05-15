import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/core/api-models/expense-model';
import { AddGroupComponent } from '../add-group/add-group.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  data: Array<Group> = [];
  filteredData: Array<Group> = [];
  filterText: string = ''

  constructor(private dialog: MatDialog, private expenseService: ExpenseService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadTableData();
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

  loadTableData() {
    const sub = this.expenseService.getGroups().subscribe(res => {
      this.data = res.data;
      this.data.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      this.filteredData = [...this.data]
      sub.unsubscribe();
    });
  }

  openModal() {
    let dialogRef = this.dialog.open(AddGroupComponent, {
      width: '40%',
      autoFocus: false,
      data: {},
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openEditModal(data: Group) {
    let dialogRef = this.dialog.open(AddGroupComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        data: data
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openDeleteDialog(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected Group?',
        title: 'Delete Group'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.expenseService.deleteGroup(id).subscribe(response => {
          if (response.code == 200) {
            this.toastr.success('Ledger deleted successfully');
          }
          else {
            this.toastr.error(response.message);
          }
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

}
