import { Component, OnInit } from '@angular/core';
import { AddBankComponent } from '../add-bank/add-bank.component';
import { MatDialog } from '@angular/material/dialog';
import { Bank, BankTransaction } from 'src/app/core/api-models/bank-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Router } from '@angular/router';
import { TransactionModalComponent } from '../../item/transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  data: Array<Bank> = [];
  filteredData: Array<Bank> = [];
  userPermissions: UserPermissions;
  constants = Constants;
  filterBankText: string = '';

  constructor(private router: Router, private dialog: MatDialog, private bankService: BankService, private toastr: ToastrService, private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.bankService.getAllBankDetails().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      for (let i = 0; i < this.filteredData.length; i++) {
        if (this.filteredData[i].totalBalance < 0) {
          this.filteredData[i].totalBalance = Math.abs(this.filteredData[i].totalBalance);
        }
      }
      this.data = this.data.filter(x => x.accountDisplayName?.toLowerCase() != 'cash');

      this.data.sort((a, b) => {
        if (a.accountDisplayName!?.toLowerCase() < b.accountDisplayName!?.toLowerCase()) { return -1; }
        if (a.accountDisplayName!?.toLowerCase() > b.accountDisplayName!?.toLowerCase()) { return 1; }
        return 0;
      });
      sub.unsubscribe();
    });
  }


  addBank() {
    let dialogRef = this.dialog.open(AddBankComponent, {
      autoFocus: false,
      width: '60%',
      data: {},
    });
    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openDeleteDialog(id: number, event: MouseEvent) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure want you to delete the selected bank?',
        title: 'Delete Bank'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.bankService.deleteBank(id!).subscribe(response => {
          this.toastr.success('Bank deleted successfully');
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  toggleMenu(itemId: number) {
    this.data.forEach(item => {
      item.isMenuVisible = item.id === itemId;
    });
  }

  openEdit(id: number, event: MouseEvent) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(AddBankComponent, {
      autoFocus: false,
      width: '60%',
      data: {
        id: id
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Bank, permissionValue);
  }

  filterBank() {
    if (this.filterBankText?.length > 0) {
      let text = this.filterBankText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.bankName && x.bankName.toLowerCase().includes(text)) ||
        (x.accountName && x.accountName.toLowerCase().includes(text)) ||
        (x.accountDisplayName && x.accountDisplayName.toLowerCase().includes(text))
      );
    } else {
      this.filteredData = [...this.data];
    }
  }

  openTransaction(transaction: any) {
    if (transaction.type != 'Opening Balance') {
      if (transaction.type == 'Purchase') {
        this.router.navigateByUrl("/app/purchase/bills/edit/" + transaction.id);
      } else if (transaction.type == 'Sale Order') {
        this.router.navigateByUrl("/app/sale/order/edit/" + transaction.id);
      } else if (transaction.type == 'Payment-Out') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-out/" + transaction.id);
      } else if (transaction.type == 'Purchase Order') {
        this.router.navigateByUrl("/app/purchase/order/edit/" + transaction.id);
      } else if (transaction.type == 'Debit Note') {
        this.router.navigateByUrl("/app/purchase/debit-note/edit/" + transaction.id);
      } else if (transaction.type == 'Sale') {
        this.router.navigateByUrl("/app/sale/invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Credit Note') {
        this.router.navigateByUrl("/app/sale/credit-note/edit/" + transaction.id);
      } else if (transaction.type == 'POS') {
        this.router.navigateByUrl("/app/sale/pos_invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Tax Invoice') {
        this.router.navigateByUrl("/app/sale/tax-invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Service Invoice') {
        this.router.navigateByUrl("/app/sale/service_invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Journal') {
        this.router.navigateByUrl("/app/other-entries/journal/edit/" + transaction.id);
      } else if (transaction.type == 'Payment-In') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-in/" + transaction.id);
      }
    }
  }

   openTransactionModal(bank:any) {
     let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
       data: {
         data: bank,
         type:'bank'
      },
    });
  }

}
