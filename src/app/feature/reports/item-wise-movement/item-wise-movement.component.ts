import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Item } from 'src/app/core/api-models/item-model';
import { GroupReport } from 'src/app/core/api-models/report-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-item-wise-movement',
  templateUrl: './item-wise-movement.component.html',
  styleUrls: ['./item-wise-movement.component.scss']
})
export class ItemWiseMovementComponent {
  data: Array<GroupReport> = [];
  groupId: number = 0;
  Items: Array<Item> = [];
  isBatchEnabled: boolean = true;
  isWarehouseEnabled: boolean = true;
  fromDate: string = '';
  toDate: string = '';
  itemData: any = {};
  sellingPrice: number = null;
  purchasePrice: number = null;
  selecteditem: Item = {};

  constructor(private reportService: ReportService, private itemService: ItemService, private authService: AuthenticationService,
    private itemGroupService: ItemGroupService, private router: Router) { }
  ngOnInit() {
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    const sub = this.itemService.getAllItemsWithDetails().subscribe(res => {
      this.Items = res.data;
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    if (this.groupId > 0) {
      this.loadTableData();
    }
  }

  loadTableData() {
    this.sellingPrice = 0;
    this.purchasePrice = 0;

    const sub = this.reportService.getAllItemWiseMovementReport(this.groupId, this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    });

    let idx = this.Items.findIndex(obj => obj.id == this.groupId)
    this.selecteditem = this.Items[idx];
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportItemWiseMovementReport
    if (this.groupId) {
      url = url + `${this.groupId}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Item Wise Movement Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportItemWiseMovementReportPdf;
    if (this.groupId) {
      url = url + `${this.groupId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Item Wise Movement Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
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
      } else if (transaction.type == 'Service Invoice') {
        this.router.navigateByUrl("/app/sale/service_invoice/edit" + transaction.id);
      } else if (transaction.type == 'Payment-In') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-in/" + transaction.id);
      }
    }
  }

}
