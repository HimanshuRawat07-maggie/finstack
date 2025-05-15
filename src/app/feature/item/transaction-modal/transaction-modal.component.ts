import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItemWithDetails, Product } from 'src/app/core/api-models/item-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { AdjustItemDialogComponent } from '../adjust-item-dialog/adjust-item-dialog.component';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit {
  data: any;
  tableData: Array<any> = [];
  filteredTableData: Array<any> = [];
  filterText: string = ''

  constructor(public dialogRef: MatDialogRef<TransactionModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { data: any, type: string }
    , private itemService: ItemService, private router: Router, private partyService: PartyService, private warehouseService: WarehouseService,
    private bankService: BankService, private expenseService: ExpenseService,private dialog:MatDialog) { }

  ngOnInit() {
    this.data = this.details.data;

    if (this.details.type == 'item') {
      const sub = this.itemService.getByProductId(this.data.id).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.tableData = this.tableData.filter(x => x.reservedQuantity > 0);
          if (this.data.type == 'Service') {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].transactionType == 'Sale' || this.tableData[i].transactionType == 'Service Invoice' || this.tableData[i].transactionType == 'Tax Invoice' || this.tableData[i].transactionType == 'POS') {
                // this.totalValue = (this.tableData[i].pricePerUnit * this.tableData[i].reservedQuantity) + this.totalValue;
              }
            }
          }
          this.filteredTableData = [...this.tableData];
        }
        sub.unsubscribe();
      });
    } else if (this.details.type == 'party') {
      const sub = this.partyService.getPartyTransactionsById(this.data.id!).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.tableData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (a.type === 'Opening Balance' && b.type !== 'Opening Balance') {
              return -1;
            } else if (a.type !== 'Opening Balance' && b.type === 'Opening Balance') {
              return 1;
            } else {
              return dateA.getTime() - dateB.getTime();
            }
          });
          this.filteredTableData = [...this.tableData];
        }
        sub.unsubscribe();
      });
    } else if (this.details.type == 'warehouse') {
      const sub = this.warehouseService.getWarehouseById(this.details.data.id).subscribe(res => {
        this.tableData = res.data.products;
        this.filteredTableData = res.data.products;
        sub.unsubscribe();
      });
    } else if (this.details.type == 'bank') {
      const sub = this.bankService.getAllBankTransactionsById(this.details.data.id).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];          
        }
        sub.unsubscribe();
      });
    } else if (this.details.type == 'ledger') {
      const sub = this.expenseService.getAllTransactionByLedgerId(this.data.id).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];

          // this.tableData.forEach(item => {
          //   this.totalAmount += item.amount;
          //   this.totalBalanceAmount += (item.amount - item.paidAmount);
          // });
        }
        sub.unsubscribe();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  openAdjustItemDialog(id: number) {
    this.close();
    let dialogRef = this.dialog.open(AdjustItemDialogComponent, {
      width: '90%',
      autoFocus: false,
      data: { id: id },
    });
  }

  getTransactionType(data: Product): string {
    if (data.transactionType === 'Opening Balance') {
      if (data.productStockType === 'OPENING_BALANCE') return 'Opening Balance';
      else if (data.productStockType === 'REDUCE_ADJUSTMENT') return 'Reduce Stock';
      else if (data.productStockType === 'ADD_ADJUSTMENT') return 'Add Stock';
      else return '';
    } else {
      return data.transactionType;
    }
  }

  filterTransactions() {
    if (this.filterText.length > 0) {
      let text = this.filterText.toLowerCase();
      switch (this.details.type) {
        case 'item':
          this.filteredTableData = this.tableData.filter(x => {
            let invNo = '';
            if (x.orderPrefix)
              invNo = x.orderPrefix;
            if (x.billNumber)
              invNo = invNo + x.billNumber;
            if (x.orderSuffix)
              invNo = invNo + x.orderSuffix;
            return (x.partyName && x.partyName.toLowerCase().includes(text)) ||
              (invNo && invNo.toLowerCase().includes(text) ||
                (x.transactionType && x.transactionType.toLowerCase().includes(text)) ||
                (x.pricePerUnit != undefined && x.pricePerUnit >= 0 && x.pricePerUnit.toString().includes(text)));
          });
          break;

        case 'party':
          this.filteredTableData = this.tableData.filter(x => {
            let invNo = '';
            if (x.orderPrefix)
              invNo = x.orderPrefix;
            if (x.orderNumber)
              invNo = invNo + x.orderNumber;
            if (x.orderSuffix)
              invNo = invNo + x.orderSuffix;            
            return (invNo && invNo.toLowerCase().includes(text) ||
              (x.type && x.type.toLowerCase().includes(text)));
          });          
          break;

        case 'warehouse':
          this.filteredTableData = this.tableData.filter(x => {
            return ((x.productName && x.productName.toLowerCase().includes(text)) ||
              (x.batchName && x.batchName.toLowerCase().includes(text)) ||
              (x.mfgDate && x.mfgDate.toLowerCase().includes(text)) ||
              (x.expDate && x.expDate.toLowerCase().includes(text)))
          });
          break;

        case 'bank':
          this.filteredTableData = this.tableData.filter(x => {
            let invNo = '';
            if (x.orderPrefix)
              invNo = x.orderPrefix;
            if (x.orderNumber)
              invNo = invNo + x.orderNumber;
            if (x.orderSuffix)
              invNo = invNo + x.orderSuffix;
            return ((invNo && invNo.toLowerCase().includes(text)) ||
              (x.partyName && x.partyName.toLowerCase().includes(text)));
          });
          break;

        case 'ledger':
          this.filteredTableData = this.tableData.filter(x => {
            let invNo = '';
            if (x.orderPrefix)
              invNo = x.orderPrefix;
            if (x.orderNumber)
              invNo = invNo + x.orderNumber;
            if (x.orderSuffix)
              invNo = invNo + x.orderSuffix;
            return ((invNo && invNo.toLowerCase().includes(text)) ||
              (x.amount != undefined && x.amount >= 0 && x.amount.toString().includes(text)));
          });
          break;
      }
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

   openTransaction(type: any,id:number) {
     let url = BusinessHelpers.openTransactionType(type);
     this.close();
     this.router.navigateByUrl(url + id);
  }
}
