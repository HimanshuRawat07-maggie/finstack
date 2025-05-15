import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ledger, TransactionByLedgerId } from 'src/app/core/api-models/expense-model';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AddLedgerModalComponent } from '../../expenses/add-ledger-modal/add-ledger-modal.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { LedgerReportTransaction } from 'src/app/core/api-models/report-model';
import { Party } from 'src/app/core/api-models/party-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { Bank } from 'src/app/core/api-models/bank-model';
import { DashboardService } from 'src/app/core/api-services/dashboard/dashboard.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-wise-report.component.html',
  styleUrls: ['./ledger-wise-report.component.scss']
})
export class LedgerWiseReportComponent {
  data: Array<any> = [];
  ledgers: Array<Ledger> = [];
  parties: Array<Party> = [];
  banks: Array<Bank> = [];
  filteredData: Array<any> = [];
  selectedItem: any = {};
  id: number | undefined = NaN;
  index: number = 0;
  tableData: Array<any> = [];
  filteredTableData: Array<any> = [];
  totalBalanceAmount: number = 0;
  totalAmount: number = 0;
  userPermissions: UserPermissions;
  constants = Constants;
  filterLedgerText: string = '';
  filterText: string = '';
  fromDate: string = '';
  toDate: string = '';
  cgstAmount: number = 0;
  sgstAmount: number = 0;
  igstAmount: number = 0;

  constructor(private dialog: MatDialog, private expenseService: ExpenseService, private router: Router, private partyService: PartyService,
    private toastr: ToastrService, private appStateService: AppStateService, private reportService: ReportService, private route: ActivatedRoute,
    private bankService: BankService, private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const partySub = this.partyService.getAllParties().subscribe(res => {
      this.parties = res.data;
      const ledgerSub = this.expenseService.getAllLedger().subscribe(res => {
        this.ledgers = res.data;
        const bankSub = this.bankService.getAllBankDetails().subscribe(res => {
          this.banks = res.data;

          const hand = this.dashboardService.getCashInHand().subscribe(res => {
            let cashInHand = res.data;

            this.parties.forEach(party => {
              this.data.push({
                id: party.id,
                title: party.name,
                email: party.email,
                group: 'Party',
                amount: party.amount
              });
            });


            this.ledgers.forEach(ledger => {
              this.data.push({
                id: ledger.id,
                title: ledger.name,
                email: null,
                group: 'Ledger',
                amount: ledger.totalAmount
              });
            });

            this.parties.forEach(party => {
              this.filteredData.push({
                id: party.id,
                title: party.name,
                email: party.email,
                group: 'Party',
                amount: party.amount

              });
            });

            this.ledgers.forEach(ledger => {
              this.filteredData.push({
                id: ledger.id,
                title: ledger.name,
                email: null,
                group: 'Ledger',
                amount: ledger.totalAmount
              });
            });

            this.filteredData.push({
              id: 0,
              title: 'Cash',
              email: null,
              group: 'Cash',
              amount: cashInHand
            });

            this.banks.forEach(bank => {
              this.data.push({
                id: bank.id,
                title: bank.accountDisplayName,
                email: null,
                group: 'Bank',
                amount: bank.totalBalance
              });
            });

            this.banks.forEach(bank => {
              this.filteredData.push({
                id: bank.id,
                title: bank.accountDisplayName,
                email: null,
                group: 'Bank',
                amount: bank.totalBalance
              });
            });

            this.filteredData.push({
              id: 0,
              title: 'CGST',
              email: null,
              group: 'CGST',
              amount: null
            });
            this.filteredData.push({
              id: 0,
              title: 'SGST',
              email: null,
              group: 'SGST',
              amount: null
            });
            this.filteredData.push({
              id: 0,
              title: 'IGST',
              email: null,
              group: 'IGST',
              amount: null
            });

            this.data = [...this.data];
            this.filteredData = [...this.filteredData];
            this.data.sort((a, b) => {
              if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
              if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
              return 0;
            });

            this.route.paramMap.subscribe(parameterMap => {
              let id = parameterMap.get('id');
              let type = parameterMap.get('type');

              if (type == 'LEDGER') {
                this.index = this.filteredData.findIndex(obj => obj.group == 'Ledger' && obj.id == id)
                console.log(this.index);

                this.selectItem(this.index);
                this.selectedItem = this.filteredData[this.index];
              } else if (type == 'PARTY') {
                this.index = this.filteredData.findIndex(obj => obj.group == 'Party' && obj.id == id);
                this.selectItem(this.index)
                this.selectedItem = this.filteredData[this.index];
              } else {
                this.selectItem(this.index);
                this.selectedItem = this.filteredData[0];
              }

            });

            hand.unsubscribe();
          });
          bankSub.unsubscribe();
        })

        ledgerSub.unsubscribe();
      });
      partySub.unsubscribe();
    });
  }

  getTaxAmount() {
    this.cgstAmount = 0;
    this.sgstAmount = 0;
    this.igstAmount = 0;
     const cgst = this.reportService.getTransactionByTax(this.fromDate, this.toDate, 'CGST').subscribe(res => {
        if (res.code == 200) {
          this.cgstAmount = res.data[res.data.length - 1]?.runningAmount!;
        }
        cgst.unsubscribe();
      });
     const sgst = this.reportService.getTransactionByTax(this.fromDate, this.toDate, 'SGST').subscribe(res => {
        if (res.code == 200) {
          this.sgstAmount = res.data[res.data.length - 1]?.runningAmount!;
        }
        sgst.unsubscribe();
      });
     const igst = this.reportService.getTransactionByTax(this.fromDate, this.toDate, 'IGST').subscribe(res => {
        if (res.code == 200) {
          this.igstAmount = res.data[res.data.length - 1]?.runningAmount;
        }
        igst.unsubscribe();
      });
  }

  selectItem(idx: number) {
    this.getTaxAmount();
    this.index = idx;
    this.selectedItem = this.filteredData[idx];
    if (this.filteredData[idx] && this.filteredData[idx].id) {
      this.id = this.filteredData[idx].id;
    }
    this.tableData = [];
    this.filteredTableData = [];
    this.totalAmount = 0;
    this.totalBalanceAmount = 0;
    if (this.selectedItem?.group && this.selectedItem.group == 'Ledger') {
      const sub = this.reportService.getAllTransactionByLedgerReport(this.id!, this.fromDate, this.toDate).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];
          this.tableData.forEach(item => {
            this.totalAmount += item.totalAmount;
            this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
          });
        }
        sub.unsubscribe();
      });
    } else if (this.selectedItem?.group && this.selectedItem.group == 'Party') {
      const sub = this.reportService.getAllTransactionByPartyWiseReport(this.id!, this.fromDate, this.toDate).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];
          this.tableData.forEach(item => {
            this.totalAmount += item.totalAmount;
            this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
          });
        }
        sub.unsubscribe();
      });
    } else if (this.selectedItem?.group && this.selectedItem.group == 'Cash') {
      const sub = this.reportService.getAllCashBookReport(this.fromDate, this.toDate).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];
          this.tableData.forEach(item => {
            this.totalAmount += item.totalAmount;
            this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
          });
        }
        sub.unsubscribe();
      });
    } else if (this.selectedItem?.group && this.selectedItem.group == 'Bank') {
      const sub = this.reportService.getAllBankBookReport(this.fromDate, this.toDate, this.id).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];
          this.tableData.forEach(item => {
            this.totalAmount += item.totalAmount;
            this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
          });
        }
        sub.unsubscribe();
      });
    } else if (this.selectedItem?.group && this.selectedItem?.group == 'CGST' || this.selectedItem?.group == 'SGST' || this.selectedItem?.group == 'IGST' || this.selectedItem?.group == 'TDS' || this.selectedItem?.group == 'TCS') {
      const sub = this.reportService.getTransactionByTax(this.fromDate, this.toDate, this.selectedItem.group).subscribe(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.filteredTableData = [...this.tableData];
          this.tableData.forEach(item => {
            this.totalAmount += item.totalAmount;
            this.totalBalanceAmount += (item.totalAmount - item.paidAmount);
          });
        }
        sub.unsubscribe();
      });
    }
  }

  getTotalAmount(amount: number) {
    if (amount < 0) {
      return Math.abs(amount);
    }
    return amount;
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
        (x.title && x.title.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredTableData = this.tableData.filter(x =>
        (x.partyName && x.partyName.toLowerCase().includes(text)) ||
        (x.paymentType && x.paymentType.toLowerCase().includes(text)) ||
        (x.invoiceNo && x.invoiceNo.toLowerCase().includes(text)) ||
        (x.totalAmount != undefined && x.totalAmount >= 0 && x.totalAmount.toString().includes(text))
      );
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

  download(type: string) {
    if (type == 'Ledger') {
      this.reportService.processing(true);
      let url = ApiUrl.exportLedgerTransactionReport
      if (this.fromDate && this.toDate && this.id) {
        url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}`
      }
      this.reportService.downloadReport(url).subscribe(res => {
        let anchorElement = document.createElement("a");
        document.body.appendChild(anchorElement);
        let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let objectURL = URL.createObjectURL(file);

        anchorElement.href = objectURL;
        anchorElement.download = 'Ledger Report.xlsx';
        anchorElement.click();
        document.body.removeChild(anchorElement);
        this.reportService.processing(false);
      });
    } else {
      this.reportService.processing(true);
      let url = ApiUrl.exportPartyTransactionReport
      if (this.fromDate && this.toDate && this.id) {
        url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}`
      }
      this.reportService.downloadReport(url).subscribe(res => {
        let anchorElement = document.createElement("a");
        document.body.appendChild(anchorElement);
        let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let objectURL = URL.createObjectURL(file);

        anchorElement.href = objectURL;
        anchorElement.download = 'Party Report.xlsx';
        anchorElement.click();
        document.body.removeChild(anchorElement);
        this.reportService.processing(false);
      });
    }
  }


  downloadAsPdf(paperOrientation: string, type: string) {
    if (type == 'Ledger') {
      this.reportService.processing(true);
      let url = ApiUrl.exportLedgerTransactionReportPdf;
      if (this.fromDate && this.toDate && this.id) {
        url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
      }
      this.reportService.downloadReport(url).subscribe(res => {
        let anchorElement = document.createElement("a");
        document.body.appendChild(anchorElement);
        let file = new Blob([res], { type: 'pdf' });
        let objectURL = URL.createObjectURL(file);

        anchorElement.href = objectURL;
        anchorElement.download = 'Ledger Report.pdf';
        anchorElement.click();
        document.body.removeChild(anchorElement);
        this.reportService.processing(false);
      });
    } else {
      this.reportService.processing(true);
      let url = ApiUrl.exportPartyTransactionReportPdf;
      if (this.fromDate && this.toDate && this.id) {
        url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
      }
      this.reportService.downloadReport(url).subscribe(res => {
        let anchorElement = document.createElement("a");
        document.body.appendChild(anchorElement);
        let file = new Blob([res], { type: 'pdf' });
        let objectURL = URL.createObjectURL(file);

        anchorElement.href = objectURL;
        anchorElement.download = 'Party Report.pdf';
        anchorElement.click();
        document.body.removeChild(anchorElement);
        this.reportService.processing(false);
      });
    }
  }


    openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }
}
