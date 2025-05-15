import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Bank } from 'src/app/core/api-models/bank-model';
import { CashBook } from 'src/app/core/api-models/report-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-bank-book',
  templateUrl: './bank-book.component.html',
  styleUrls: ['./bank-book.component.scss']
})
export class BankBookComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<CashBook> = [];
  banks: Array<Bank> = [];
  bankid: number = 0;

  constructor(private reportService: ReportService, private bankService: BankService, private router: Router) { }

  ngOnInit() {
    const sub = this.bankService.getAllBankDetails().subscribe(res => {
      this.banks = res.data;
      sub.unsubscribe();
    });
  }

  loadTableData() {
    if (this.bankid > 0) {
      const sub = this.reportService.getAllBankBookReport(this.fromDate, this.toDate, this.bankid).subscribe(res => {
        this.data = res.data;
        sub.unsubscribe();
      });
    }
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportBankBookReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&companyPaymentTypeId=${this.bankid}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Bank Book Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportBankBookReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&companyPaymentTypeId=${this.bankid}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Bank Book Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

   openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

  getTotalCredit() {
    let total = 0
    this.data.forEach(item => {
      total = item.cashIn + total;
    });
    return total;
  }

  getTotalDebit() {
    let total = 0
    this.data.forEach(item => {
      total = item.cashOut + total;
    });
    return total;
  }
}
