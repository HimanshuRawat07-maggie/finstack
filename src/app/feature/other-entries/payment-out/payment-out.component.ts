import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { SaleInvoiceGetAll } from 'src/app/core/api-models/sale-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-out',
  templateUrl: './payment-out.component.html',
  styleUrls: ['./payment-out.component.scss'],
  providers: [DatePipe]
})
export class PaymentOutComponent implements OnInit {
  fromDate: string = '';
  data: Array<SaleInvoiceGetAll> = [];
  filterData: Array<SaleInvoiceGetAll> = [];
  filterText: string = '';
  toDate: string = '';
  userPermissions: UserPermissions;
  constants = Constants;

  constructor(private datePipe: DatePipe, private router: Router, private dialog: MatDialog, private saleService: SaleService,
    private appStateService: AppStateService, private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  loadTableData() {
    this.saleService.getAllPaymentOut(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filterData = res.data;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data) {
          // if (parseInt(this.data[i].paymentInNumber!, 10) > this.number) {
          //   this.number = parseInt(this.data[i].paymentInNumber!, 10)
          // }
        }
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path)
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected receipt?',
        title: 'Delete Receipt'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.saleService.deletePaymentOut(id!).subscribe(response => {
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.PaymentOut, permissionValue);
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
        return (x.partyName && x.partyName.toLowerCase().includes(text)) || (x.ledgerName && x.ledgerName.toLowerCase().includes(text)) ||
          (x.customerName && x.customerName.toLowerCase().includes(text)) ||
          (invNo && invNo.toLowerCase().includes(text));
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
