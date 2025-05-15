import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { DebitNote } from 'src/app/core/api-models/purchase';
import { PurchaseService } from 'src/app/core/api-services/purchase/purchase.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-purchase-asset',
  templateUrl: './purchase-asset.component.html',
  styleUrls: ['./purchase-asset.component.scss']
})
export class PurchaseAssetComponent {
fromDate: string = '';
  toDate: string = '';
  data: Array<DebitNote> = [];
  filterData: Array<DebitNote> = [];
  filterText: string = '';
  paid: number = 0;
  unpaid: number = 0;
  total: number = 0;
  userPermissions: UserPermissions;
  constants = Constants;

  constructor(private datePipe: DatePipe, private purchaseService: PurchaseService, private dialog: MatDialog, private appStateService: AppStateService,
    private saleService: SaleService, private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  loadTableData() {
    this.paid = 0;
    this.unpaid = 0;
    this.total = 0;
    const sub = this.purchaseService.getAllPurchaseAsset(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.filterData = [...res.data];
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
        message: 'Are you sure you want to delete the selected purchase asset?',
        title: 'Delete Purchase Asset'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.purchaseService.deletePurchaseAsset(id!).subscribe(response => {
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
      return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.PurchaseBills, permissionValue);
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
