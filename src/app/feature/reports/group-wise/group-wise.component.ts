import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/core/api-models/expense-model';
import { GroupWiseTransaction } from 'src/app/core/api-models/report-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';

@Component({
  selector: 'app-group-wise',
  templateUrl: './group-wise.component.html',
  styleUrls: ['./group-wise.component.scss']
})
export class GroupWiseComponent {
  data: Array<Group> = [];
  filteredData: Array<Group> = [];
  selectedItem: Group = {};
  id: number | undefined = NaN;
  index: number = 0;
  tableData: Array<GroupWiseTransaction> = [];
  filteredTableData: Array<GroupWiseTransaction> = [];
  totalBalanceAmount: number = 0;
  totalAmount: number = 0;
  filterLedgerText: string = '';
  filterText: string = '';
  fromDate: string = '';
  toDate: string = '';
  partyAndLedgerArray: Array<string> = [];
  particularFilter: string = 'All';

  constructor(private expenseService: ExpenseService, private router: Router, private toastr: ToastrService, private appStateService: AppStateService, private reportService: ReportService) {
  }

  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.expenseService.partyGroups().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      this.data.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      this.selectItem(this.index)
      this.selectedItem = this.data[0];
      sub.unsubscribe();
    });
  }

  selectItem(idx: number) {
    this.particularFilter = 'All';
    this.filterText = '';
    this.index = idx;
    this.selectedItem = this.data[idx];
    if (this.data[idx].id) {
      this.id = this.data[idx].id;
    }
    this.tableData = [];
    this.filteredTableData = [];
    this.totalAmount = 0;
    this.totalBalanceAmount = 0;
    const sub = this.reportService.getAllTransactionByGroupReport(this.id!, this.fromDate, this.toDate).subscribe(res => {
      if (res.code === 200) {
        this.tableData = res.data;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].partyName) {
            this.partyAndLedgerArray.push(
              this.tableData[i].partyName
            )
          } else if (this.tableData[i].ledgerName) {
            this.tableData[i].ledgerName
          }
        }
        this.partyAndLedgerArray.unshift('All');
        this.partyAndLedgerArray = this.partyAndLedgerArray.filter((value, index, self) => self.indexOf(value) === index);
        this.filteredTableData = [...this.tableData];
        this.tableData.forEach(item => {
          this.totalAmount += item.totalAmount;
          this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
        });
        this.filterTransactions();
      }
      sub.unsubscribe();
    });
  }


  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.selectItem(this.index);
  }

  filterLedger() {
    if (this.filterLedgerText?.length > 0) {
      let text = this.filterLedgerText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredTableData = this.filteredTableData.filter(x =>
        (x.partyName && x.partyName.toLowerCase().includes(text)) ||
        (x.ledgerName && x.ledgerName.toLowerCase().includes(text)) ||
        (x.paymentType && x.paymentType.toLowerCase().includes(text)) ||
         (x.invoiceNo && x.invoiceNo.toLowerCase().includes(text)) ||
        (x.totalAmount != undefined && x.totalAmount >= 0 && x.totalAmount.toString().includes(text)));
    } else {
      this.filteredTableData = [...this.tableData];
      if (this.particularFilter != 'All') {
        this.filterTransactionsByParticular();

      }
    }
  }

  filterTransactionsByParticular() {
    if (this.particularFilter != 'All') {
      let particulartext = this.particularFilter.toLowerCase();
      this.filteredTableData = this.filteredTableData.filter(x =>
        (x.partyName && x.partyName.toLowerCase().includes(particulartext)) ||
        (x.ledgerName && x.ledgerName.toLowerCase().includes(particulartext)));
    } else {
      this.filteredTableData = [...this.tableData];
      if (this.filterText.length > 0) {
        this.filterTransactions();
      }
    }
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportGroupWiseReport;
    if (this.fromDate && this.toDate && this.id) {
      url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Group Wise Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportGroupWiseReportPdf;
    if (this.fromDate && this.toDate && this.id) {
      url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Group Wise Report.pdf';
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
