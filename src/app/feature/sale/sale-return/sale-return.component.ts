import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CreditNoteGetAll } from 'src/app/core/api-models/sale-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { SafeUrl } from '@angular/platform-browser';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss'],
  providers: [DatePipe]
})
export class SaleReturnComponent {
  data: Array<CreditNoteGetAll> = [];
  filterData: Array<CreditNoteGetAll> = [];
  filterText: string = '';
  fromDate: string = '';
  toDate: string = '';
  dateFormat: string = 'This Month';
  paid: number = 0;
  unpaid: number = 0;
  total: number = 0;
  userPermissions: UserPermissions;
  constants = Constants;
  pdfURL: SafeUrl;
  isEInvoiceEnabled = false;

  constructor(private datePipe: DatePipe, private saleService: SaleService, private dialog: MatDialog, private appStateService: AppStateService,
    private toastr: ToastrService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-01')!;
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.isEInvoiceEnabled = this.authService.isEInvoiceEnabled == 'true';
  }

  loadTableData() {
    this.paid = 0;
    this.unpaid = 0;
    this.total = 0;
    const sub = this.saleService.getAllCreditNote(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filterData = res.data;
      if (this.data.length != 0) {
        for (let i = 0; i < this.data.length; i++) {
          this.paid = this.data[i].paidAmount + this.paid;
          this.total = this.data[i].amount + this.total;
        }
        this.unpaid = this.total - this.paid;
      }
      else {
        this.paid = 0;
        this.unpaid = 0;
        this.total = 0;
      }
      sub.unsubscribe();
    });
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected credit note?',
        title: 'Delete Credit Note'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.saleService.deleteSaleReturn(id!).subscribe(response => {
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  generateEInvoice(id: number) {
    const sub = this.saleService.generateEInvoice(id).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.CreditNote, permissionValue);
  }

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

  filterTransactions() {
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
        return (x.partyName && x.partyName.toLowerCase().includes(text)) ||
          (invNo && invNo.toLowerCase().includes(text));
      }
      );
    } else {
      this.filterData = [...this.data];
    }
  }
}
