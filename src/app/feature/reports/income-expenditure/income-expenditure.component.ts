import { Component } from '@angular/core';
import { TrialBalanceItem } from 'src/app/core/api-models/report-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';

@Component({
  selector: 'app-income-expenditure',
  templateUrl: './income-expenditure.component.html',
  styleUrls: ['./income-expenditure.component.scss']
})
export class IncomeExpenditureComponent {
  public fromDate: string = '';
  public toDate: string = '';
  public reportData: Array<TrialBalanceItem>;
  public indirectExpenses: Array<TrialBalanceItem>;
  public grossProfitLoss: Array<TrialBalanceItem>;
  public netProfitLoss: Array<TrialBalanceItem>;

  public reportDebitSideData: Array<TrialBalanceItem>;
  public reportCreditSideData: Array<TrialBalanceItem>;
  public reportDebitSideExpenseData: Array<TrialBalanceItem>;
  public reportCreditSideIncomeData: Array<TrialBalanceItem>;
  hideZeroBalance = false;

  constructor(private reportService: ReportService, private companyService: CompanyService) { }

  refreshReport() {
    this.hideZeroBalance = false;
    const sub = this.reportService.incomeAndExpenditure(this.fromDate, this.toDate).subscribe(res => {
      this.reportData = res.data;
      this.reportData = this.reportData.filter(x => x);
      this.reportData.forEach(x => {
        x.depth = 0;
        this.calcDepth(x);
      });
      this.reportData.forEach(child => {
        if (child?.children?.length > 0) {
          child.children.forEach(x => {
            if (x.debitAmount > 0 && x.creditAmount > 0) {
              if (x.debitAmount > x.creditAmount) {
                x.debitAmount = x.debitAmount - x.creditAmount;
                x.creditAmount = 0;
              } else if (x.creditAmount > x.debitAmount) {
                x.creditAmount = x.creditAmount - x.debitAmount;
                x.debitAmount = 0;
              }
            }
          });
        }
      });
      this.addTotalFromChildren(this.reportData);
      this.reportData.forEach(x => {
        if (x.debitAmount > 0 && x.creditAmount > 0) {
          if (x.debitAmount > x.creditAmount) {
            x.debitAmount = x.debitAmount - x.creditAmount;
            x.creditAmount = 0;
          } else if (x.creditAmount > x.debitAmount) {
            x.creditAmount = x.creditAmount - x.debitAmount;
            x.debitAmount = 0;
          }
        }
      });

      this.indirectExpenses = this.reportData.filter(x => x.title === 'Indirect Expenses' || x.title === 'Indirect Incomes');
      this.reportData = this.reportData.filter(x => x.title != 'Indirect Expenses' && x.title != 'Indirect Incomes');

      let grossDebit = this.getTotalDebit(this.reportData);
      let grossCredit = this.getTotalCredit(this.reportData);

      if (grossCredit > grossDebit) {
        this.grossProfitLoss = [{
          children: [],
          creditAmount: grossCredit - grossDebit,
          debitAmount: 0,
          title: 'Gross Income',
          depth: 0,
          isExpanded: true
        }];
      } else {
        this.grossProfitLoss = [{
          children: [],
          creditAmount: 0,
          debitAmount: grossDebit - grossCredit,
          title: 'Gross Income',
          depth: 0,
          isExpanded: true
        }];
      }

      let netDebit = grossDebit + this.indirectExpenses.filter(x => x.depth === 0).reduce((a, v) => a += Math.abs(v.debitAmount), 0);
      let netCredit = grossCredit + this.indirectExpenses.filter(x => x.depth === 0).reduce((a, v) => a += Math.abs(v.creditAmount), 0);

      if (netCredit > netDebit) {
        this.netProfitLoss = [{
          children: [],
          creditAmount: netCredit - netDebit,
          debitAmount: 0,
          title: 'Net Income',
          depth: 0,
          isExpanded: true
        }];
      } else {
        this.netProfitLoss = [{
          children: [],
          creditAmount: 0,
          debitAmount: netDebit - netCredit,
          title: 'Net Income',
          depth: 0,
          isExpanded: true
        }];
      }

      this.reportDebitSideData = [...this.reportData];
      this.reportCreditSideData = [...this.reportData];

      let directExpIdx = this.reportDebitSideData.findIndex(x => x.title === 'Direct Expenses');
      this.reportDebitSideData.splice(directExpIdx + 1, this.reportDebitSideData.length - directExpIdx);
      this.reportCreditSideData.splice(0, directExpIdx + 1);
      this.reportDebitSideExpenseData = [...this.indirectExpenses.filter(x => x.title === 'Indirect Expenses')];
      this.reportCreditSideIncomeData = [...this.indirectExpenses.filter(x => x.title === 'Indirect Incomes')];

      if (grossCredit > grossDebit) {
        this.reportCreditSideIncomeData.splice(0, 0, {
          children: [],
          creditAmount: grossCredit - grossDebit,
          debitAmount: 0,
          title: 'Gross Inome b/f',
          depth: 0,
          isExpanded: true
        });
      } else {
        this.reportDebitSideExpenseData.splice(0, 0, {
          children: [],
          creditAmount: 0,
          debitAmount: grossDebit - grossCredit,
          title: 'Gross Income b/f',
          depth: 0,
          isExpanded: true
        });
      }

      sub.unsubscribe();
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportIncomeExpenditureReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Income & Expediture Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  removePurchaseSaleAccount(data: Array<TrialBalanceItem>): Array<TrialBalanceItem> {
    return data.filter(x => x.title != 'Purchase Account' && x.title != 'Sales Account');
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.refreshReport();
  }

  addTotalFromChildren(data: Array<TrialBalanceItem>) {
    data.forEach(node => {
      if (node?.children?.length >= 0) {
        this.addTotalFromChildren(node.children);
        node.debitAmount += node.children.reduce((a, v) => a += Math.abs(v.debitAmount), 0);
        node.creditAmount += node.children.reduce((a, v) => a += Math.abs(v.creditAmount), 0);
      }
    })
  }

  calcDepth(node: TrialBalanceItem) {
    if (node.children)
      node.children.forEach(x => {
        x.depth = node.depth + 1;
        this.calcDepth(x);
      });
  }

  getTotalCredit(data: Array<TrialBalanceItem>): number {
    let total = 0;
    data.forEach(x => { total += x.creditAmount; });
    return total;
  }

  getTotalDebit(data: Array<TrialBalanceItem>): number {
    let total = 0;
    data.forEach(x => { total += x.debitAmount; });
    return total;
  }


   downloadPdf() {
    let details: any
    this.companyService.getCompanyDetailsById().subscribe(res => {
      details = res.data;

      const divId = 'divToConvert'; // ID of the HTML section you want to convert
      const fileName = 'Income Expenditure Report';
      const companyDetails = {
        name: details.name,
        address: `${details.billingAddress.address}`,
        state: ` ${details.billingAddress.state.name}`,
        pincode: `${details.billingAddress.pincode}`
      };
      const reportName = 'Income Expenditure'; // Name of the report
      const dateString = `${this.fromDate} to ${this.toDate}` // Date string
      this.reportService.downloadPdf(divId, fileName, companyDetails, reportName, dateString);
    });
  }

    download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportIncomeExpenditureReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Income & Expenditure Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }
}
