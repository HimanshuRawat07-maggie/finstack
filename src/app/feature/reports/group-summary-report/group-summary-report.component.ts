import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { GetProductGroup } from 'src/app/core/api-models/item-group';
import { GroupReport, StockSummaryReport } from 'src/app/core/api-models/report-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-group-summary-report',
  templateUrl: './group-summary-report.component.html',
  styleUrls: ['./group-summary-report.component.scss']
})
export class GroupSummaryReportComponent {
  data: Array<GroupReport> = [];
  groupId: number = 0;
  productGroup: Array<GetProductGroup> = [];
  isBatchEnabled: boolean = true;
  isWarehouseEnabled: boolean = true;
  fromDate: string = '';
  toDate: string = '';

  constructor(private reportService: ReportService, private itemgroupService: ItemGroupService, private router: Router, private authService: AuthenticationService) { }
  ngOnInit() {
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    const sub = this.itemgroupService.getAllProductGroup().subscribe(res => {
      this.productGroup = res.data;
      this.productGroup.unshift({
        productGroupName: 'All',
        id: 0
      });
    });
  }

  loadTableData() {
    const sub = this.reportService.getAllGroupSummaryReport(this.groupId, this.fromDate, this.toDate).subscribe(res => {
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
    let url = ApiUrl.exportGroupSummaryReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.groupId}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Group Summary Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportGroupSummaryReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.groupId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Group Summary Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }
}
