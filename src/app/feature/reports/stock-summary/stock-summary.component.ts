import { Component } from '@angular/core';
import { GetProductGroup } from 'src/app/core/api-models/item-group';
import { GroupReport, StockSummary, StockSummaryReport } from 'src/app/core/api-models/report-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.scss']
})
export class StockSummaryComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<StockSummary> = [];
  filteredData: Array<StockSummary> = [];
  groups: Array<GetProductGroup> = [];
  groupName: string = 'ALL';

  constructor(private reportService: ReportService, private itemgroupService: ItemGroupService) { }

  ngOnInit() {
    const sub = this.itemgroupService.getAllProductGroup().subscribe(res => {
      this.groups = res.data;
      sub.unsubscribe();
    });
    this.loadTableData();
  }

  loadTableData() {
    if (this.fromDate?.length > 0 && this.toDate?.length > 0) {
      const sub = this.reportService.getAllStockSummary(this.fromDate, this.toDate).subscribe(res => {
        this.data = res.data;
        this.filteredData = [...res.data];
        this.filterData()
        sub.unsubscribe();
      });
    }
  }

  filterData() {
    if (this.groupName === 'ALL') {
      this.filteredData = [...this.data];
    } else if (this.groupName === 'Not In Any Group') {
      this.filteredData = [...this.data.filter(x => x.groupName === undefined || x.groupName === null || x.groupName?.trim()?.length === 0)];
    } else {
      this.filteredData = [...this.data.filter(x => x.groupName && x.groupName === this.groupName)];
    }
  }


  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportStockSummaryReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Summary Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    },
    );
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportStockSummaryReportPdf
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Summary Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

}
