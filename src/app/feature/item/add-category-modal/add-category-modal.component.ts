import { Component, ViewChild, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductGroupName } from 'src/app/core/api-models/item-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {
  categoryName: ProductGroupName = {};
  isGroupFormVisible = true;
  status: string = 'Add'

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('GroupForm') GroupForm?: any;
  constructor(public dialogRef: MatDialogRef<AddCategoryModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: number, name: string }, private itemGroupService: ItemGroupService, private toastr: ToastrService) { }

  ngOnInit() {
    this.categoryName.id = this.data.message;
    this.categoryName.name = this.data.name;
    if (this.categoryName.id != null) {
      this.status = 'Edit'
    }
  }

  onSubmit() {
    if (this.isGroupFormVisible) {
      this.GroupForm.control.markAllAsTouched();
    }
    if (!this.GroupForm.form.valid)
      return;
    
    if (this.categoryName.id != null) {
      const sub = this.itemGroupService.updateProductGroup(this.categoryName).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close();
          this.toastr.success('Data updated successfully');
          this.confirmed.emit(true);
        } else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    } else {
      const hub = this.itemGroupService.AddProductGroup(this.categoryName).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close(this.categoryName);
          this.toastr.success('Data saved successfully');
          this.confirmed.emit(true);
        } else {
          this.toastr.error(res.message);
        }
        hub.unsubscribe();
      });
    }
  }
}
