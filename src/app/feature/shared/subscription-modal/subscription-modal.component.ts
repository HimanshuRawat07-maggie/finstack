import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent {

  constructor(public dialogRef: MatDialogRef<SubscriptionModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, btnText: string }) {
  }

  subscribe() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }
}
