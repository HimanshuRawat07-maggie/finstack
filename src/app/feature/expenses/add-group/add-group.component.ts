import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/core/api-models/expense-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent {
  data: Group = {
    parentGroupName: ''
  };
  isGroupFormVisible = true;
  status: string = 'Add';
  groups: Array<Group> = [];

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('GroupForm') GroupForm?: any;
  constructor(public dialogRef: MatDialogRef<AddGroupComponent>, @Inject(MAT_DIALOG_DATA) public details: { data: Group }, private expenseService: ExpenseService, private toastr: ToastrService) { }

  ngOnInit() {
    const sub = this.expenseService.getGroups().subscribe(res => {
      this.groups = res.data;
      sub.unsubscribe();
    });
    if (this.details.data) {
      this.data = this.details.data;
      this.status = 'Edit'
      // this.data.parentGroupName = this.data.subGroup ? this.data.subGroup : this.data.mainGroup;   
    }
  }

  onSubmit() {
    if (this.isGroupFormVisible) {
      this.GroupForm.control.markAllAsTouched();
    }
    if (!this.GroupForm.form.valid)
      return;

    if (this.details.data) {
      const sub = this.expenseService.updateGroup(this.data).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
          this.toastr.success('Data updated successfully');
          this.cancel();
        }
        else {
          this.toastr.error(res.message);
        }
      })
    }
    else {
      const sub = this.expenseService.saveGroup(this.data).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
          this.toastr.success('Data saved successfully');
          this.cancel();
        }
        else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(true);
  }
}
