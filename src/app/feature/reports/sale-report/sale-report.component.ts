import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseReport } from 'src/app/core/api-models/report-model';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss'],
})
export class SaleReportComponent {
  fromDate: string = '';
  toDate: string = '';
  dateFormat: string = Constants.ThisMonth;
  data: Array<PurchaseReport> = []
  total: number = 0;
  paid: number = 0;
  unpaid: number = 0;

  constructor(private reportService: ReportService, private router: Router, private datePipe: DatePipe) {
    let date = localStorage.getItem('date');
    if (date?.trim()?.length > 0) {
      this.dateFormat = Constants.Custom;
      if (date.split('-').length == 3) {
        this.fromDate = date;
        this.toDate = date;
      } else {
        let startDate = new Date(date);
        this.fromDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
        this.toDate = this.datePipe.transform(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0), 'yyyy-MM-dd');;
      }
      localStorage.removeItem('date');
    } else {
      let todaysDate = new Date();
      this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1), 'yyyy-MM-dd')!;
      this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0), 'yyyy-MM-dd')!;
    }
  }

  loadTableData() {
    this.total = 0;
    this.paid = 0;
    this.unpaid = 0;
    const sub = this.reportService.getAllSalesReport(this.fromDate, this.toDate).subscribe(res => {
      this.data = [...res.data];
      let amount = 0;
      for (let i = 0; i < this.data.length; i++) {
        this.paid = this.data[i].received_PaidAmount + this.paid;
        this.total = this.data[i].totalAmount + this.total;
        amount = this.data[i].taxableAmount + amount;
        this.data[i].runningBalance = amount;
      }
      this.unpaid = this.total - this.paid;
      setTimeout(() => { document.getElementById('title').click(); }, 100);
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
    let url = ApiUrl.exportSaleReport
    if (this.fromDate && this.toDate) {
      url = url + `&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Sale Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportSaleReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Sale Report.pdf';
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
