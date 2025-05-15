import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Party, PartyTransaction } from 'src/app/core/api-models/party-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';

@Component({
  selector: 'app-party-wise',
  templateUrl: './party-wise.component.html',
  styleUrls: ['./party-wise.component.scss']
})
export class PartyWiseComponent {
  data: Array<Party> = [];
  filteredData: Array<Party> = [];
  selectedItem: Party = {};
  tableData: Array<PartyTransaction> = [];
  filteredTableData: Array<PartyTransaction> = [];
  filterText: string = '';
  constants = Constants;
  filterPartyText: string = ''
  fromDate: string = '';
  toDate: string = '';
  id: number | undefined = NaN;
  index: number = 0;



  constructor(private router: Router, private partyService: PartyService, private toastr: ToastrService,
    private appStateService: AppStateService, private reportService: ReportService) { }

  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    this.partyService.getAllParties().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      this.selectedItem = this.data[0];
      this.selectItem(this.index)
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  selectItem(idx: number) {
    this.index = idx;
    const id = this.data[idx].id;
    this.selectedItem = this.data[idx];
    this.id = this.data[idx].id;
    this.tableData = [];
    this.filteredTableData = [];
    const subs = this.partyService.getPartyById(id!).subscribe(res => {
      this.selectedItem = res.data;
    });
    const sub = this.reportService.getAllTransactionByPartyReport(this.id!, this.fromDate, this.toDate).subscribe(res => {
      if (res.code === 200) {
        this.tableData = res.data;
        this.filteredTableData = [...this.tableData];
      }
      sub.unsubscribe();
    });
  }

  toggleMenu(itemId: number) {
    this.data.forEach(item => {
      if (item.id !== itemId) {
        item.isMenuVisible = false;
      }
    });

    const selectedItem = this.data.find(item => item.id === itemId);
    if (selectedItem) {
      selectedItem.isMenuVisible = !selectedItem.isMenuVisible;
    }
  }

  onDocumentClick() {
    this.data.forEach(item => {
      item.isMenuVisible = false;
    });
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredTableData = this.tableData.filter(x => {  
         let invNo = '';
        if (x.orderPrefix)
          invNo = x.orderPrefix;
        if (x.orderNumber)
          invNo = invNo + x.orderNumber;
        if (x.orderSuffix)
          invNo = invNo + x.orderSuffix;

        return (x.type && x.type.toLowerCase().includes(text)) ||
          (x.orderNumber && x.orderNumber.toLowerCase().includes(text)) ||
          (invNo && invNo.toLowerCase().includes(text))||
        (x.balance != undefined && x.balance >= 0 && x.balance.toString().includes(text)) ||
        (x.total != undefined && x.total >= 0 && x.total.toString().includes(text))
      }
      );
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

  filterParty() {
    if (this.filterPartyText?.length > 0) {
      let text = this.filterPartyText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

  getNetAmount(amount: number | undefined | null) {
    if (amount == undefined || amount === null)
      return 0;
    return Math.abs(amount);
  }

  getTransctionType(transaction: PartyTransaction) {
    if (transaction.type === 'Opening Balance' && transaction.total) {
      if (transaction.total > 0)
        return 'Receivable Opening Balance';
      else
        return 'Payable Opening Balance';
    }
    return transaction.type;
  }


   openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportpartyReport;
    if (this.fromDate && this.toDate && this.id) {
      url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Party Wise Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.selectItem(this.index);
  }

  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportpartyReportPdf;
    if (this.fromDate && this.toDate && this.id) {
      url = url + `${this.id}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Party Wise Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }
}
