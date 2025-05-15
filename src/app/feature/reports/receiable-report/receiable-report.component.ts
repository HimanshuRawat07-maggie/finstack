import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceivableReport } from 'src/app/core/api-models/report-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-receiable-report',
  templateUrl: './receiable-report.component.html',
  styleUrls: ['./receiable-report.component.scss']
})
export class ReceiableReportComponent implements OnInit {
  fromDate: string = '';
  toDate: string = '';
  data: Array<ReceivableReport> = [];
  runningBalance: number = 0;

  constructor(private reportService: ReportService, private router: Router) { }
  ngOnInit() {
  }

  loadTableData() {
    const sub = this.reportService.getAllReceivable(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      for (let i = 0; i < this.data.length; i++) {
        this.runningBalance = this.runningBalance + this.data[i].balance
        this.data[i].runningBalance = parseFloat(this.runningBalance.toFixed(2));
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
    let url = ApiUrl.exportreceivableReport
    if (this.fromDate && this.toDate) {
      url = url + `?startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Receivable Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportreceivableReportPdf
    if (this.fromDate && this.toDate) {
      url = url + `?startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Receivable Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

  getRunningBalance(amount: number) {
    console.log(this.runningBalance + "---" + amount);
    this.runningBalance = amount + this.runningBalance;
    return this.runningBalance;
  }
}
