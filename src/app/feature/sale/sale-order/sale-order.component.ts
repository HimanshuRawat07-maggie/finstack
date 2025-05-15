import { Component, OnInit } from '@angular/core';
import { SaleOrderGetAll } from 'src/app/core/api-models/sale-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss']
})
export class SaleOrderComponent implements OnInit {
  data: Array<SaleOrderGetAll> = [];
  filterData: Array<SaleOrderGetAll> = [];
  fromDate: string = '';
  toDate: string = '';
  dateFormat: string = 'This Month';
  completed: number = 0;
  pending: number = 0;
  total: number = 0;
  userPermissions: UserPermissions;
  constants = Constants;
  filterText: string = '';

  constructor(private saleService: SaleService, private dialog: MatDialog, private datePipe: DatePipe, private appStateService: AppStateService, private sanitizer: DomSanitizer,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  loadTableData() {
    this.completed = 0;
    this.pending = 0;
    this.total = 0;
    const sub = this.saleService.getAllSaleOrder(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filterData = res.data;
      if (this.data.length != 0) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].orderStatus == 'Order Created') {
            this.pending = this.data[i].amount + this.pending;
          }
          if (this.data[i].orderStatus == 'Order Completed') {
            this.completed = this.data[i].amount + this.completed;
          }
          this.total = this.data[i].amount + this.total;
        }
      }
      else {
        this.completed = 0;
        this.pending = 0;
        this.total = 0;
      }
      sub.unsubscribe();
    })
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected sale order?',
        title: 'Delete Sale Order'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.saleService.deleteSaleOrder(id!).subscribe(response => {
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

  hasPermission(permissionValue: string, module?: string) {
    if (module == 'Sale') {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Sale, permissionValue);
    }
    else {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.SaleOrder, permissionValue);
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
