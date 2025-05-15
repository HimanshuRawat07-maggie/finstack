import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { GroupReport } from 'src/app/core/api-models/report-model';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-warehouse-summary-report',
  templateUrl: './warehouse-summary-report.component.html',
  styleUrls: ['./warehouse-summary-report.component.scss']
})
export class WarehouseSummaryReportComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<GroupReport> = [];
  warehouseId: number = 0;
  warehouses: Array<Warehouse> = [];
  isBatchEnabled: boolean = true;
  isWarehouseEnabled: boolean = true;



  constructor(private reportService: ReportService, private warehouseService: WarehouseService, private authService: AuthenticationService) { }
  ngOnInit() {
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    const sub = this.warehouseService.getAllWarehouses().subscribe(res => {
      this.warehouses = res.data;
      this.warehouses.unshift({
        name: 'All',
        id: 0
      });
      sub.unsubscribe();
    });
  }

  loadTableData() {
    const sub = this.reportService.getAllWarehouseSummaryReport(this.warehouseId, this.fromDate, this.toDate).subscribe(res => {
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
    let url = ApiUrl.exportWarehouseSummaryReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.warehouseId}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }

    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Warehouse Summary Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportWarehouseSummaryReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.warehouseId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Warehouse Summary Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }
}
