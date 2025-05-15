import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/core/api-models/item-model';
import { StockJournalReport } from 'src/app/core/api-models/report-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-stock-journal-report',
  templateUrl: './stock-journal-report.component.html',
  styleUrls: ['./stock-journal-report.component.scss']
})
export class StockJournalReportComponent implements OnInit {
  fromDate: string = '';
  toDate: string = '';
  data: Array<StockJournalReport> = [];
  itemId: number = 0;
  Items: Array<Item> = [];

  constructor(private reportService: ReportService, private router: Router, private itemService: ItemService) { }

  ngOnInit() {
    const sub = this.itemService.getAllItems().subscribe(res => {
      this.Items = res.data;
      this.Items.unshift({
        id: 0,
        name: 'All'
      })
    });
  }

  loadTableData() {
    const sub = this.reportService.getStockJournalReport(this.itemId, this.fromDate, this.toDate).subscribe(res => {
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
    let url = ApiUrl.exportCashBookReport
    if (this.fromDate && this.toDate) {
      url = url + `?startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Journal Register Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportStockJournalReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.itemId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Journal Register Report.pdf';
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
