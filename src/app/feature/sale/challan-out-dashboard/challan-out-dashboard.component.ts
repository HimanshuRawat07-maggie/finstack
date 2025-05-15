import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-challan-out-dashboard',
  templateUrl: './challan-out-dashboard.component.html',
  styleUrls: ['./challan-out-dashboard.component.scss']
})
export class ChallanOutDashboardComponent {
  data: Array<any> = [];
  filterData: Array<any> = [];
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
    const sub = this.saleService.getAllChallanOut(this.fromDate, this.toDate).subscribe(res => {
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
        message: 'Are you sure you want to delete the selected challan-out?',
        title: 'Delete Challan-out'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        let id: number | undefined = this.data[idx].id;
        this.saleService.deleteChallanOut(id!).subscribe(response => {
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
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.ChallanOut, permissionValue);
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
