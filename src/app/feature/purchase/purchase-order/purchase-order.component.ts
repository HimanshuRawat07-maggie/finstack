import { Component, OnInit } from '@angular/core';
import { DebitNote } from 'src/app/core/api-models/purchase';
import { PurchaseService } from 'src/app/core/api-services/purchase/purchase.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  data: Array<DebitNote> = [];
  filterData: Array<DebitNote> = [];
  filterText: string = '';
  completed: number = 0;
  pending: number = 0;
  total: number = 0;
  fromDate: string = '';
  toDate: string = '';
  userPermissions: UserPermissions;
  constants = Constants;


  constructor(private purchaseService: PurchaseService, private dialog: MatDialog, private datePipe: DatePipe, private appStateService: AppStateService,
    private saleService: SaleService, private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  loadTableData() {
    const sub = this.purchaseService.getAllPurchaseOrders(this.fromDate, this.toDate).subscribe(res => {
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
    });
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected purchase order?',
        title: 'Delete Purchase Order'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.purchaseService.deletePurchaseOrder(id!).subscribe(response => {
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
    if (module == 'Purchase') {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.PurchaseBills, permissionValue);
    }
    else {
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.PurchaseOrder, permissionValue);
    }
  }

  openPdf(id: number, prefix?: string, orderNo?: string, suffix?: string) {
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
