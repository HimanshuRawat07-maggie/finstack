import { Component } from '@angular/core';
import { TrialBalanceItem } from 'src/app/core/api-models/report-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent {
  public asOfDate: Date = new Date();
  public reportData: Array<TrialBalanceItem>;
  fromDate: string = '';
  toDate: string = '';
  isDataExpand = false;
  hideZeroBalance = false;
  collapseAndExpandText: string = 'Expand All';
  hideAndShowZeroBalanceText: string = 'Hide Zero Balance';

  constructor(private reportService: ReportService, private companyService: CompanyService) { }

  ngOnInit() {
  }

  
  loadReportData() {
    this.isDataExpand = false;
    this.hideZeroBalance = false;
    this.collapseAndExpandText = 'Expand All';
    const sub = this.reportService.trialBalance(this.fromDate, this.toDate).subscribe(res => {
      this.reportData = res.data;
      this.reportData.forEach(x => {
        x.depth = 0;
        x.isExpanded = true;
        x.creditAmount = Math.abs(x.creditAmount);
        x.debitAmount = Math.abs(x.debitAmount);
        x.openingCreditBalance = Math.abs(x.openingCreditBalance);
        x.openingDebitBalance = Math.abs(x.openingDebitBalance);
        x.closingDebitBalance = Math.abs(x.closingDebitBalance);
        x.closingCreditBalance = Math.abs(x.closingCreditBalance);
        this.calcDepth(x);
      });
      this.addTotalFromChildren(this.reportData);
      let totalCredit = this.getTotalCredit();
      let totalDebit = this.getTotalDebit();

      if (totalCredit > totalDebit) {
        this.reportData.push({
          title: 'Difference in balances',
          children: [],
          creditAmount: 0,
          debitAmount: 0,
          closingDebitBalance: totalCredit - totalDebit,
          closingCreditBalance: 0,
          depth: 1,
          isExpanded: true
        });
      } else if (totalDebit > totalCredit) {
        this.reportData.push({
          title: 'Difference in balances',
          children: [],
          closingCreditBalance: totalDebit - totalCredit,
          closingDebitBalance: 0,
          creditAmount: 0,
          debitAmount: 0,
          depth: 1,
          isExpanded: true
        });
      }
      sub.unsubscribe();
    });
  }


  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportTrialBalanceReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Trial Balance Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportTrialBalanceReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Trial Balance Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadReportData();
  }

  addTotalFromChildren(data: Array<TrialBalanceItem>) {
    data.forEach(node => {
      if (node?.children?.length >= 0) {
        this.addTotalFromChildren(node.children);
        node.debitAmount += node.children.reduce((a, v) => a += Math.abs(v.debitAmount), 0);
        node.creditAmount += node.children.reduce((a, v) => a += Math.abs(v.creditAmount), 0);

        node.openingDebitBalance += node.children.reduce((a, v) => a += Math.abs(v.openingDebitBalance), 0);
        node.openingCreditBalance += node.children.reduce((a, v) => a += Math.abs(v.openingCreditBalance), 0);
        node.closingCreditBalance += node.children.reduce((a, v) => a += Math.abs(v.closingCreditBalance), 0);
        node.closingDebitBalance += node.children.reduce((a, v) => a += Math.abs(v.closingDebitBalance), 0);
        node.netAmount += node.children.reduce((a, v) => a += Math.abs(v.closingDebitBalance), 0);
      }
    })
  }

  calcDepth(node: TrialBalanceItem) {
    if (node.children)
      node.children.forEach(x => {
        x.depth = node.depth + 1;
        x.creditAmount = Math.abs(x.creditAmount);
        x.debitAmount = Math.abs(x.debitAmount);
        x.openingCreditBalance = Math.abs(x.openingCreditBalance);
        x.openingDebitBalance = Math.abs(x.openingDebitBalance);
        x.closingDebitBalance = Math.abs(x.closingDebitBalance);
        x.closingCreditBalance = Math.abs(x.closingCreditBalance);
        this.calcDepth(x);
      });
  }

  getTotalCredit(): number {
    let total = 0;
    if (this.reportData?.length > 0)
      this.reportData.forEach(x => {
        total += x.closingCreditBalance;
      });
    return total;
  }

  getTotalDebit(): number {
    let total = 0;
    if (this.reportData?.length > 0)
      this.reportData.forEach(x => {
        total += x.closingDebitBalance;
      });
    return total;
  }

  downloadPdf() {
    let details: any
    this.companyService.getCompanyDetailsById().subscribe(res => {
      details = res.data;

      const divId = 'divToConvert'; // ID of the HTML section you want to convert
      const fileName = 'Trial Balance Report';
      const companyDetails = {
        name: details.name,
        address: `${details.billingAddress.address}`,
        state: ` ${details.billingAddress.state.name}`,
        pincode: `${details.billingAddress.pincode}`
      };
      const reportName = 'Trial Balance'; // Name of the report
      const dateString = `${this.fromDate} to ${this.toDate}` // Date string
      this.reportService.downloadPdf(divId, fileName, companyDetails, reportName, dateString);
    });
  }

  collapseAndExpandData() {
    if (this.isDataExpand) {      
      this.collapseAndExpandText = 'Collapse All';
        this.reportData.forEach(x => {
        this.collapseAndExpandChildren(x);
      });

    } else {
      this.collapseAndExpandText = 'Expand All';
        this.reportData.forEach(x => {
          this.collapseAndExpandChildren(x);
      });
    }
  }

  collapseAndExpandChildren(node:TrialBalanceItem) {
    if (node.children) {      
      if (this.isDataExpand) {
         node.children.forEach(x => {
          x.isExpanded =true;
         this.collapseAndExpandChildren(x);
      });
      }
      else {
          node.children.forEach(x => {
          x.isExpanded =false;
         this.collapseAndExpandChildren(x);
      });
      }
     }
  }

}
