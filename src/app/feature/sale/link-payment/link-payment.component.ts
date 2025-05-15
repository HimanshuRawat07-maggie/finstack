import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartyTransaction } from 'src/app/core/api-models/party-model';
import { LinkedTransaction } from 'src/app/core/models/sale-purchase-template';

@Component({
  selector: 'app-link-payment',
  templateUrl: './link-payment.component.html',
  styleUrls: ['./link-payment.component.scss']
})
export class LinkPaymentComponent {
  constructor(public dialogRef: MatDialogRef<LinkPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      transactions: Array<PartyTransaction>,
      selectedTransaction: Array<LinkedTransaction>,
      amount: number
    }) {
    this.data.transactions.forEach(transaction => { transaction.amount = Math.abs(transaction.amount); })
    if (this.data.selectedTransaction?.length > 0) {
      this.data.selectedTransaction.forEach(transaction => {
        let idx = this.data.transactions.findIndex(x => x.id == transaction.transactionId);
        if (idx > -1) {
          this.data.transactions[idx].isSelected = true;
          this.data.transactions[idx].selectedAmount = transaction.amount;
        }
      });
    }
  }

  getTransctionType(transaction: PartyTransaction) {
    if (transaction.type === 'Opening Balance' && transaction.total) {
      if (transaction.total > 0)
        return 'Receivable Opening Balance';
      else
        return 'Payable Opening Balance';
    }
    return transaction.type;
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.data);
  }

  onSelectTransaction(idx: number) {
    setTimeout(() => {
      if (this.data.transactions[idx].isSelected) {
        this.data.transactions[idx].selectedAmount = this.data.transactions[idx].amount - this.data.transactions[idx].paidAmount;
      } else {
        this.data.transactions[idx].selectedAmount = 0;
      }
    }, 100);
  }

  getUnusedAmount() {
    let totalReceived = 0;
    this.data.transactions.forEach(transaction => {
      if (transaction.isSelected && transaction.selectedAmount > 0)
        totalReceived += transaction.selectedAmount;
    });
    return (this.data.amount ?? 0) - totalReceived;
  }
}
