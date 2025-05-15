import { Component } from '@angular/core';
import { SaleInvoiceGetAll } from 'src/app/core/api-models/sale-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { EWayBillModalComponent } from '../e-way-bill-modal/e-way-bill-modal.component';
import { CancelEinvoiceComponent } from '../cancel-einvoice/cancel-einvoice.component';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss']
})
export class SaleInvoiceComponent {
  data: Array<SaleInvoiceGetAll> = [];
  filteredData: Array<SaleInvoiceGetAll> = [];
  paid: number = 0;
  unpaid: number = 0;
  total: number = 0;
  fromDate: string = '';
  toDate: string = '';
  userPermissions: UserPermissions;
  constants = Constants;
  isEWayBillEnabled = false;
  isEInvoiceBillEnabled = false;
  filterText: string = '';

  constructor(private saleService: SaleService, private dialog: MatDialog, private appStateService: AppStateService,
    private toastr: ToastrService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.isEWayBillEnabled = this.authService.isEWayBillEnabled == 'true';
    this.isEInvoiceBillEnabled = this.authService.isEInvoiceEnabled == 'true';
  }

  loadTableData() {
    this.paid = 0;
    this.unpaid = 0;
    this.total = 0;
    const sub = this.saleService.getAllSaleInvoices(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      if (this.data.length != 0) {
        for (let i = 0; i < this.data.length; i++) {
          this.paid = this.data[i].paidAmount + this.paid;
          this.total = this.data[i].amount + this.total;
        }
        this.unpaid = this.total - this.paid;
      } else {
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
        message: 'Are you sure you want to delete the selected sale invoice?',
        title: 'Delete Sale Invoice'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.saleService.deleteSaleInvoice(id!).subscribe(response => {
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  openEwayBillModal(id: number) {
    let dialogRef = this.dialog.open(EWayBillModalComponent, {
      width: '50%',
      autoFocus: false,
      data: {
        id: id
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  hasPermission(permissionValue: string, module?: string) {
    if (module == 'Return') {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.CreditNote, permissionValue);
    }
    else {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Sale, permissionValue);
    }
  }

  openPdf(id: number, prefix: string, orderNo: string, suffix: string) {
    this.saleService.processing(true);
    this.saleService.openPdf(id).subscribe({
      next: res => {
        this.saleService.processing(false);
        this.dialog.open(PdfModalComponent, {
          width: '95%',
          height: '95%',
          autoFocus: false,
          data: {
            res: res,
            prefix: prefix,
            orderNo: orderNo,
            suffix: suffix,
            id:id
          },
        });
      },
      error: err => {
        this.saleService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });
  }

  openPosPdf(id: number, prefix: string, orderNo: string, suffix: string) {
    this.saleService.processing(true);
    this.saleService.openPosPdf(id).subscribe({
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
            suffix: suffix,
            type:'POS',
            
          },
        });
      },
      error: err => {
        this.saleService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });
  }

  generateEInvoice(id: number) {
    const sub = this.saleService.generateEInvoice(id).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.loadTableData();
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    });
  }

  cancelEInvoice(id: number) {
      let dialogRef = this.dialog.open(CancelEinvoiceComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        id:id
      },
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.loadTableData();
      }
    })
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredData = this.data.filter(x => {
        let invNo = '';
        if (x.orderPrefix)
          invNo = x.orderPrefix;
        if (x.orderNumber)
          invNo = invNo + x.orderNumber;
        if (x.orderSuffix)
          invNo = invNo + x.orderSuffix;
        return (x.partyName && x.partyName.toLowerCase().includes(text)) ||
         (x.alias && x.alias.toLowerCase().includes(text)) ||
          (invNo && invNo.toLowerCase().includes(text));
      }
      );
    } else {
      this.filteredData = [...this.data];
    }
  }
}
