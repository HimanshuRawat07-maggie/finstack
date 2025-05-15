import { Component, OnInit } from '@angular/core';
import { AddLedgerModalComponent } from '../add-ledger-modal/add-ledger-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import {
  Ledger,
  TransactionByLedgerId,
} from 'src/app/core/api-models/expense-model';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import {
  Constants,
  ModuleConstants,
} from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Router } from '@angular/router';
import { TransactionModalComponent } from '../../item/transaction-modal/transaction-modal.component';
import { DashboardService } from 'src/app/core/api-services/dashboard/dashboard.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss'],
})
export class LedgerComponent implements OnInit {
  data: Array<Ledger> = [];
  filteredData: Array<Ledger> = [];
  userPermissions: UserPermissions;
  constants = Constants;
  filterLedgerText: string = '';

  constructor(
    private dialog: MatDialog,
    private expenseService: ExpenseService,
    private router: Router,
    private toastr: ToastrService,
    private appStateService: AppStateService,private dashboardService:DashboardService
  ) {}

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe((res) => {
      this.userPermissions = res;
    });
    this.loadTableData();
  }

  loadTableData() {
    // const sub = this.expenseService.getAllLedger().subscribe((res) => {
    //   this.data = res.data;
    //   this.filteredData = res.data;
    //   this.data.sort((a, b) => {
    //     if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) {
    //       return -1;
    //     }
    //     if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    //   sub.unsubscribe();
    // });

       const sub = this.expenseService.getAllLedger().subscribe(res => {
      const hand = this.dashboardService.getCashInHand().subscribe(response => {
        let cashInHand = response.data;
        this.data = res.data;
        this.data.push({
          id:0,
          name: 'CASH',
          totalAmount:cashInHand
        })
        this.filteredData = this.data;
        this.data.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
        sub.unsubscribe();
        hand.unsubscribe();
      });
    });
  }

  openEdit(data: Ledger,event:MouseEvent) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(AddLedgerModalComponent, {
      width: '60%',
      autoFocus: false,
      data: {
        data: data,
      },
    });

    dialogRef.componentInstance.confirmed.subscribe((res) => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openModal() {
    let dialogRef = this.dialog.open(AddLedgerModalComponent, {
      width: '60%',
      autoFocus: false,
    });
    dialogRef.componentInstance.confirmed.subscribe((res) => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openDeleteDialog(idx: number, e: MouseEvent) {
    e.stopPropagation();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected ledger?',
        title: 'Delete Ledger',
      },
    });

    dialogRef.componentInstance.confirmed.subscribe((res) => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.expenseService.deleteLedger(id!).subscribe((response) => {
          if (response.code == 200) {
            this.toastr.success('Ledger deleted successfully');
          } else {
            this.toastr.error(response.message);
          }
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  getTotalAmount(amount: number) {
    if (amount < 0) {
      return Math.abs(amount);
    }
    return amount;
  }

  hasPermission(permissionValue: string, transaction?: any) {
    if (transaction) {
      if (transaction.identifier == 'Purchase') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.PurchaseBills,
          permissionValue
        );
      } else if (transaction.identifier == 'Sale Order') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.SaleOrder,
          permissionValue
        );
      } else if (transaction.identifier == 'Payment-Out') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.PaymentOut,
          permissionValue
        );
      } else if (transaction.identifier == 'Purchase Order') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.PurchaseOrder,
          permissionValue
        );
      } else if (transaction.identifier == 'Debit Note') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.DebitNote,
          permissionValue
        );
      } else if (transaction.identifier == 'Sale') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.Sale,
          permissionValue
        );
      } else if (transaction.identifier == 'Credit Note') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.CreditNote,
          permissionValue
        );
      } else if (transaction.identifier == 'POS') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.PosInvoice,
          permissionValue
        );
      } else if (transaction.identifier == 'Tax Invoice') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.TaxInvoice,
          permissionValue
        );
      } else if (transaction.identifier == 'Service Invoice') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.ServiceInvoice,
          permissionValue
        );
      } else if (transaction.identifier == 'Journal') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.Journal,
          permissionValue
        );
      } else if (transaction.identifier == 'Payment-In') {
        return BusinessHelpers.hasPermission(
          this.userPermissions,
          ModuleConstants.PaymentIn,
          permissionValue
        );
      }
    }
    return BusinessHelpers.hasPermission(
      this.userPermissions,
      ModuleConstants.Ledger,
      permissionValue
    );
  }

  filterLedger() {
    if (this.filterLedgerText?.length > 0) {
      let text = this.filterLedgerText.toLowerCase();
      this.filteredData = this.data.filter(
        (x) => x.name && x.name.toLowerCase().includes(text)
      );
    } else {
      this.filteredData = [...this.data];
    }
  }



  openTransactionModal(ledger: Ledger) {
    let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
      data: {
        data: ledger,
        type: 'ledger',
      },
    });
  }
}
