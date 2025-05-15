import { Component, OnInit } from '@angular/core';
import { TransactionByLedgerId } from 'src/app/core/api-models/expense-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  data: Array<TransactionByLedgerId> = [];
  filterData: Array<TransactionByLedgerId> = [];
  filterText: string = '';
  fromDate: string = '';
  toDate: string = '';
  userPermissions: UserPermissions;
  constants = Constants;

  constructor(private expenseService: ExpenseService, private dialog: MatDialog, private appStateService: AppStateService,
    private toastr: ToastrService, private saleService: SaleService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  loadTableData() {
    const sub = this.expenseService.getAllJournals(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filterData = res.data;
      sub.unsubscribe();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected journal?',
        title: 'Delete Journal'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.expenseService.deleteJournal(id!).subscribe(response => {
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Journal, permissionValue);
  }

  filterTransactions() {
    // if (this.filterText?.length > 0) {
    //   let text = this.filterText.toLowerCase();
    //   this.filterData = this.data.filter(x =>
    //     (x.partyName && x.partyName.toLowerCase().includes(text)) ||
    //     (x.ledgerName && x.ledgerName.toLowerCase().includes(text)) ||
    //     (x.customerName && x.customerName.toLowerCase().includes(text)) ||
    //     (x.orderNumber && x.orderNumber.toLowerCase().includes(text))
    //   );
    // } else {
    //   this.filterData = [...this.data];
    // }

    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filterData = this.data.filter(x => {
        let invNo = '';
        if (x.orderPrefix)
          invNo = x.orderPrefix;
        if (x.orderNumber)
          invNo = invNo + x.orderNumber;
        if (x.orderSuffix)
          invNo = invNo + x.orderSuffix;
        return (invNo && invNo.toLowerCase().includes(text) ||
          (x.partyName && x.partyName.toLowerCase().includes(text)) ||
          (x.ledgerName && x.ledgerName.toLowerCase().includes(text)) ||
          (x.customerName && x.customerName.toLowerCase().includes(text)) ||
          (x.orderNumber && x.orderNumber.toLowerCase().includes(text)));
      }
      );
    } else {
      this.filterData = [...this.data];
    }
  }

  pdfURL: SafeUrl;
  openPdf(id: number, prefix: string, orderNo: string, suffix: string) {
    this.saleService.processing(true);
    this.saleService.openPdf(id).subscribe({
      next: res => {
        this.saleService.processing(false);
        this.dialog.open(PdfModalComponent, {
          width: '90%',
          height: '90%',
          autoFocus: false,
          data: {
            res: res,
            prefix: prefix,
            orderNo: orderNo,
            suffix: suffix
          },
        });
      },
      error: err => {
        this.saleService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });
  }
}
