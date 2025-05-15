import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GetProductGroup } from 'src/app/core/api-models/item-group';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';

@Component({
  selector: 'app-link-item-group',
  templateUrl: './link-item-group.component.html',
  styleUrls: ['./link-item-group.component.scss']
})

export class LinkItemGroupComponent {
  data: Array<GetProductGroup> = [];
  groupName: string = '';

  @Output() confirmed = new EventEmitter<boolean>();
  constructor(public dialogRef: MatDialogRef<LinkItemGroupComponent>, @Inject(MAT_DIALOG_DATA) public item: { message: number }, private toastr: ToastrService, private itemgroupService: ItemGroupService) { }

  ngOnInit() {
    const sub = this.itemgroupService.getAllProductGroup().subscribe(res => {
      this.data = res.data;
      this.data = this.data.filter(x => x.productGroupName.toLowerCase() != 'not in any group');
      sub.unsubscribe();
    });
  }


  cancel() {
    this.dialogRef.close();
  }

  linkItem() {
    const sub = this.itemgroupService.linkProduct(this.item.message, this.groupName).subscribe(res => {
      if (res.code == 200) {
        this.confirmed.emit(true);
        this.dialogRef.close();
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }
}
