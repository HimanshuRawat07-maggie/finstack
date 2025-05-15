import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DayBookReport } from 'src/app/core/api-models/report-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss'],
  providers: [DatePipe]
})
export class DayBookComponent {
  date: string = '';
  data: Array<DayBookReport> = [];
  fromDate: string = '';
  toDate: string = '';
   minDate: string = '';

  constructor(private datePipe: DatePipe, private reportService: ReportService, private router: Router) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.reportService.getDayBookReport(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    });
  }


  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportDayBookReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Day Book Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportDayBookReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Day Book Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

    openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

  // openTransaction(transaction: any) {
  //   if (transaction.type != 'Opening Balance') {
  //     if (transaction.type == 'Purchase') {
  //       this.router.navigateByUrl("/app/purchase/bills/edit/" + transaction.id);
  //     } else if (transaction.type == 'Sale Order') {
  //       this.router.navigateByUrl("/app/sale/order/edit/" + transaction.id);
  //     } else if (transaction.type == 'Payment-Out') {
  //       this.router.navigateByUrl("/app/other-entries/edit-payment-out/" + transaction.id);
  //     } else if (transaction.type == 'Purchase Order') {
  //       this.router.navigateByUrl("/app/purchase/order/edit/" + transaction.id);
  //     } else if (transaction.type == 'Debit Note') {
  //       this.router.navigateByUrl("/app/purchase/debit-note/edit/" + transaction.id);
  //     } else if (transaction.type == 'Sale') {
  //       this.router.navigateByUrl("/app/sale/invoice/edit/" + transaction.id);
  //     } else if (transaction.type == 'Credit Note') {
  //       this.router.navigateByUrl("/app/sale/credit-note/edit/" + transaction.id);
  //     } else if (transaction.type == 'POS') {
  //       this.router.navigateByUrl("/app/sale/pos_invoice/edit/" + transaction.id);
  //     } else if (transaction.type == 'Tax Invoice') {
  //       this.router.navigateByUrl("/app/sale/tax-invoice/edit/" + transaction.id);
  //     } else if (transaction.type == 'Service Invoice') {
  //       this.router.navigateByUrl("/app/sale/service_invoice/edit/" + transaction.id);
  //     } else if (transaction.type == 'Journal') {
  //       this.router.navigateByUrl("/app/other-entries/journal/edit/" + transaction.id);
  //     } else if (transaction.type == 'Service Invoice') {
  //       this.router.navigateByUrl("/app/sale/service_invoice/edit" + transaction.id);
  //     } else if (transaction.type == 'Payment-In') {
  //       this.router.navigateByUrl("/app/other-entries/edit-payment-in/" + transaction.id);
  //     }
  //   }
  // }
}
