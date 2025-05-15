import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Party } from 'src/app/core/api-models/party-model';
import { PurchaseReport, ReceivableReport } from 'src/app/core/api-models/report-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-sale-order-report',
  templateUrl: './sale-order-report.component.html',
  styleUrls: ['./sale-order-report.component.scss']
})
export class SaleOrderReportComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<PurchaseReport> = []
  parties: Array<Party> = [];
  partyId: number = 0;

  constructor(private reportService: ReportService, private partyService: PartyService, private router: Router) { }
  ngOnInit() {
    this.partyService.getAllParties().subscribe(res => {
      this.parties = res.data;
      this.parties.unshift({
        name: 'All',
        id: 0
      });
    });
  }

  loadTableData() {
    const sub = this.reportService.getAllSalesOrderReport(this.partyId, this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportSaleOrderReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.partyId}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Sale Order Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportSaleOrderReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.partyId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Sale Order Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

   openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

}
