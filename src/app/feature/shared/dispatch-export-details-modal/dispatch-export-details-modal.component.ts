import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constants } from 'src/app/core/constants/app-constant';
import { ExportDispatch } from 'src/app/core/models/sale-purchase-template';

@Component({
  selector: 'app-dispatch-export-details-modal',
  templateUrl: './dispatch-export-details-modal.component.html',
  styleUrls: ['./dispatch-export-details-modal.component.scss']
})
export class DispatchExportDetailsModalComponent {
  isDispatchForm: boolean = true;
   minDate: string = '';


  constructor(public dialogRef: MatDialogRef<DispatchExportDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string, exportAndDispatchDetails: ExportDispatch }) {
    this.isDispatchForm = this.data.type === Constants.Dispatch;
        this.minDate = localStorage.getItem('minDate');
    if (data.exportAndDispatchDetails === undefined || data.exportAndDispatchDetails === null) {
      data.exportAndDispatchDetails = {};
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data.exportAndDispatchDetails);
  }
}
