import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Ledger, Group, cashLedger } from 'src/app/core/api-models/expense-model';
import { GstSlab, HsnCode } from 'src/app/core/api-models/item-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';

@Component({
  selector: 'app-add-expense-category-modal',
  templateUrl: './add-ledger-modal.component.html',
  styleUrls: ['./add-ledger-modal.component.scss']
})
export class AddLedgerModalComponent implements OnInit {
  status: string = 'Add';
  data: Ledger = {
    transactionType: 'TO_RECEIVE',
  };
  isExpenseCategoryFormVisible = true;
  isHsnTableVisible: boolean = false;
  groups: Array<Group> = [];
  hsnTable: Array<HsnCode> = [];
  minDate: string = '';
  taxSlabs: Array<GstSlab> = [];
  gstTaxSlabs: Array<GstSlab> = [];
  cashLedger: cashLedger = {}
  isCashLedger = false;
  isSubmitButtonDisable = false;

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('ExpenseCategoryForm') ExpenseCategoryForm?: any;
  constructor(public dialogRef: MatDialogRef<AddLedgerModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { data: Ledger },
    private expenseService: ExpenseService, private toastr: ToastrService, private itemService: ItemService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.data.asOfDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    
    const sub = this.expenseService.getGroups().subscribe(res => {
      this.groups = res.data;
      this.groups = this.groups.filter(obj =>
        obj.name !== 'Sundry Debtors' && obj.name !== 'Bank Accounts' && obj.name !== 'Bank Account' && obj.name !== 'Sundry Creditors' && obj.name !== 'Cash-In-Hand' && obj.name !== 'Profit & Loss A/c');
      this.groups.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      if (this.details) {
        this.status = 'Edit';
        this.data = this.details.data;
        if (this.details.data.id == 0 && this.details.data.name=='CASH') {
          this.isCashLedger = true;
          const hub = this.expenseService.getCashOpeningbalance().subscribe(res => {
            if (res.code == 200) {
              this.data.openingBalance = res.data.openingBalance;
              if (res.data.asOfDate) {
                this.data.asOfDate=res.data.asOfDate
              } else {
                this.data.asOfDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
              }
            }
            hub.unsubscribe();
          })
        } else {
          this.data.openingBalance = Math.abs(this.data.openingBalance)
          let idx = this.groups.findIndex(value => value.name === this.details.data.masterGroupName);
          this.data.masterGroupId = this.groups[idx].id
        }
      }
      sub.unsubscribe();
    });
    const tax = this.itemService.getAllSlab().subscribe(res => {
      this.taxSlabs = res.data;
      this.gstTaxSlabs = this.taxSlabs.filter((str) => str.name.startsWith('G') || str.name.startsWith('E') || str.name.startsWith('N'));
    })
  }

  onSubmit() {
    if (this.isExpenseCategoryFormVisible) {
      this.ExpenseCategoryForm.control.markAllAsTouched();
    }
    if (!this.ExpenseCategoryForm.form.valid)
    {
      this.isSubmitButtonDisable = false;
      return;
    }

    if (this.data.name.toLowerCase() == 'cash' && !this.isCashLedger) {
      this.toastr.error(`Ledger name can't be ${this.data.name}`);
      return;
    }
    if (this.details) {
      if (this.data.openingBalance == null) {
        this.data.openingBalance = 0;
      }
      if (this.details.data.id == 0) {
        this.cashLedger.openingBalance = this.data.openingBalance;
        this.cashLedger.asOfDate = this.data.asOfDate;
        const sub = this.expenseService.updateCashOpeningBalance(this.cashLedger).subscribe(res => {
          if (res.code == 200) {
            this.dialogRef.close();
            this.toastr.success('Data updated successfully');
            this.confirmed.emit(true);
          } else {
            this.toastr.error(res.message);
          }
          this.isSubmitButtonDisable = false;
          sub.unsubscribe();
        });
      } else {
        const sub = this.expenseService.updateLedger(this.data).subscribe(res => {
          if (res.code == 200) {
            this.dialogRef.close();
            this.toastr.success('Data updated successfully');
            this.confirmed.emit(true);
          } else {
            this.toastr.error(res.message);
          }
          this.isSubmitButtonDisable = false;
          sub.unsubscribe();
        });
      }
    } else {
      if (this.data.openingBalance == null) {
        this.data.openingBalance = 0;
      }
      const sub = this.expenseService.saveLedger(this.data).subscribe(res => {
        if (res.code == 200) {
          this.dialogRef.close();
          this.toastr.success('Data saved successfully');
          this.confirmed.emit(true);
        } else {
          this.toastr.error(res.message);
        }
        this.isSubmitButtonDisable = false;
        sub.unsubscribe();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }


  getHsnCode() {
    if (this.data?.hsnCode?.length >= 3) {
      const sub = this.itemService.getHsnCode(this.data.hsnCode!).subscribe(res => {
        if (res.code == 200) {
          this.hsnTable = res.data;
          this.isHsnTableVisible = true;
        }
        sub.unsubscribe();
      });
    }
  }

  setHsnCode(item: HsnCode) {
    this.data.hsnCode = item.code;
    this.isHsnTableVisible = false;
  }

}
