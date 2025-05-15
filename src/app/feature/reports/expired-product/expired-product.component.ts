import { Component } from '@angular/core';
import { from } from 'rxjs';
import { GroupReport } from 'src/app/core/api-models/report-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-expired-product',
  templateUrl: './expired-product.component.html',
  styleUrls: ['./expired-product.component.scss']
})
export class ExpiredProductComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<GroupReport> = [];
  groupId: number = null;
  isBatchEnabled: boolean = true;
  isWarehouseEnabled: boolean = true;
  type: string = 'All'

  constructor(private reportService: ReportService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
  }

  loadTableData() {
    const sub = this.reportService.getExpiredProductReport(this.fromDate, this.toDate, this.type).subscribe(res => {
      this.data = res.data;
      if (this.data?.length > 0) {
        // this.data.forEach(x => {
        //   if (x.expDate != null) {
        //     x.expDate = `${x.expDate.split('-')[1]}-${x.expDate.split('-')[0]}-01`;
        //   }
        // });
      }
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
    let url = ApiUrl.exportExpiredProductReport;
    if (this.fromDate && this.toDate) {
      url = url + `${this.type}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Expired Product Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportExpiredProductReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.type}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Expired Product Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

}
