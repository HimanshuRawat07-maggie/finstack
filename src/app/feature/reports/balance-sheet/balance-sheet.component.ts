import { Component } from '@angular/core';
import { TrialBalanceItem } from 'src/app/core/api-models/report-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent {
  public fromDate: string = '';
  public toDate: string = '';
  public reportData: Array<TrialBalanceItem>;
  public assetsData: Array<TrialBalanceItem>;
  public liabilitiesData: Array<TrialBalanceItem>;
  public netProfitLoss: Array<TrialBalanceItem>;
  isDataExpand = false;
  hideZeroBalance = false;
  collapseAndExpandText: string = 'Expand All';
  hideAndShowZeroBalanceText: string = 'Hide Zero Balance';

  constructor(private reportService: ReportService, private companyService: CompanyService) { }

  refreshReport() {
    this.isDataExpand = false;
    this.hideZeroBalance = false;
    this.collapseAndExpandText= 'Expand All';
    const sub = this.reportService.balanceSheet(this.fromDate, this.toDate).subscribe(res => {
      this.reportData = res.data;
      this.reportData.forEach(x => {
        x.depth = 0;
        x.isExpanded = true
        this.calcDepth(x);
      });
      this.addTotalFromChildren(this.reportData);

      this.assetsData = this.reportData.filter(x => x.title === 'ASSETS');
      this.liabilitiesData = this.reportData.filter(x => x.title === 'LIABILITIES');

      if (Math.abs(this.assetsData[0].netAmount) > Math.abs(this.liabilitiesData[0].netAmount)) {
        this.liabilitiesData.push({
          title: 'Difference in balances',
          children: [],
          creditAmount: 0,
          debitAmount: 0,
          netAmount: Math.abs(this.assetsData[0].netAmount) - Math.abs(this.liabilitiesData[0].netAmount),
          depth: 1,
          isExpanded: true
        });
        this.liabilitiesData[0].netAmount = this.assetsData[0].netAmount;
      } else if (Math.abs(this.liabilitiesData[0].netAmount) > Math.abs(this.assetsData[0].netAmount)) {
        this.assetsData.push({
          title: 'Difference in balances',
          children: [],
          netAmount: Math.abs(this.liabilitiesData[0].netAmount) - Math.abs(this.assetsData[0].netAmount),
          debitAmount: 0,
          creditAmount: 0,
          depth: 1,
          isExpanded: true
        });
        this.assetsData[0].netAmount = this.liabilitiesData[0].netAmount;
      }

      sub.unsubscribe();
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


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportBalanceSheetReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Balance Sheet Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  addTotalFromChildren(data: Array<TrialBalanceItem>) {
    data.forEach(node => {
      if (node?.children?.length >= 0) {
        this.addTotalFromChildren(node.children);
        node.debitAmount += node.children.reduce((a, v) => a += Math.abs(v.debitAmount), 0);
        node.creditAmount += node.children.reduce((a, v) => a += Math.abs(v.creditAmount), 0);
        node.netAmount += node.children.reduce((a, v) => a += v.netAmount, 0);
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

  getNetAmount(data: TrialBalanceItem) {
    return Math.abs(data.netAmount);
  }

  downloadPdf() {
    let details: any
    this.companyService.getCompanyDetailsById().subscribe(res => {
      details = res.data;

      const divId = 'divToConvert'; // ID of the HTML section you want to convert
      const fileName = 'Balance Sheet Report';
      const companyDetails = {
        name: details.name,
        address: `${details.billingAddress.address}`,
        state: ` ${details.billingAddress.state.name}`,
        pincode: `${details.billingAddress.pincode}`
      };
      const reportName = 'Balance Sheet'; // Name of the report
      const dateString = `${this.fromDate} to ${this.toDate}` // Date string
      this.reportService.downloadPdf(divId, fileName, companyDetails, reportName, dateString);
    });
  }

    download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportBalanceSheetReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Balance Sheet Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
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
