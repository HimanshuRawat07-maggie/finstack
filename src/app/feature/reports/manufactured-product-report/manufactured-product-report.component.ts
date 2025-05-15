import { Component } from '@angular/core';
import { from } from 'rxjs';
import { StockSummaryReport } from 'src/app/core/api-models/report-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-manufactured-product-report',
  templateUrl: './manufactured-product-report.component.html',
  styleUrls: ['./manufactured-product-report.component.scss']
})
export class ManufacturedProductReportComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<StockSummaryReport> = [];
  isBatchEnabled: boolean = true;
  isWarehouseEnabled: boolean = true;

  constructor(private reportService: ReportService, private authService: AuthenticationService) { }
  ngOnInit() {
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
  }

  loadTableData() {
    const sub = this.reportService.getAllManufacturedProductReport(this.fromDate, this.toDate).subscribe(res => {
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
    let url = ApiUrl.exportManufacturedProductReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Manufacturing Register Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportManufacturedProductReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Manufacturing Register Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }
}
