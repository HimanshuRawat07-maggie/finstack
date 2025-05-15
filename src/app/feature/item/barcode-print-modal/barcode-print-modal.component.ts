import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemPrintDetails } from 'src/app/core/api-models/item-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-barcode-print-modal',
  templateUrl: './barcode-print-modal.component.html',
  styleUrls: ['./barcode-print-modal.component.scss']
})
export class BarcodePrintModalComponent implements OnInit {
  column: number = 0;

    @Output() confirmed = new EventEmitter<boolean>();
  constructor(public dialogRef: MatDialogRef<BarcodePrintModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { details: Array<ItemPrintDetails> },
    private toastr: ToastrService, private itemGroupService: ItemGroupService,private dialog:MatDialog) { }
 
  ngOnInit(){

  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.column == 0) {
      this.toastr.error('Select Column First');
      return;
    }

    this.itemGroupService.processing(true);
    this.itemGroupService.printBarCode(this.data.details, this.column).subscribe({
      next: res => {
        this.confirmed.emit(true);
        this.close();
        this.itemGroupService.processing(false);
        this.dialog.open(PdfModalComponent, {
          width: '90%',
          height: '90%',
          autoFocus: false,
          data: {
           
          },
        });
      },
      error: err => {
        this.itemGroupService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });

  }

}
