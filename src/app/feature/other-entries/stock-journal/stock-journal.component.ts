import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/core/api-models/item-model';
import { StockJournalReport } from 'src/app/core/api-models/report-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { AdjustItemDialogComponent } from '../../item/adjust-item-dialog/adjust-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-journal',
  templateUrl: './stock-journal.component.html',
  styleUrls: ['./stock-journal.component.scss']
})
export class StockJournalComponent {
 fromDate: string = '';
  toDate: string = '';
  data: Array<StockJournalReport> = [];
  itemId: number = 0;
  Items: Array<Item> = [];

  constructor(private reportService: ReportService, private router: Router, private itemService: ItemService,
    private dialog:MatDialog
  ) { }

  ngOnInit() {
    const sub = this.itemService.getAllItems().subscribe(res => {
      this.Items = res.data;
      this.Items.unshift({
        id: 0,
        name: 'All'
      })
    });
  }

  loadTableData() {
    const sub = this.reportService.getStockJournalReport(this.itemId, this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    });
  }

    openAdjustItemDialog(id: number) {
    let dialogRef = this.dialog.open(AdjustItemDialogComponent, {
      width: '90%',
      autoFocus: false,
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadTableData();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportCashBookReport
    if (this.fromDate && this.toDate) {
      url = url + `?startDate=${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Journal Register Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportStockJournalReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.itemId}&startDate=${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Stock Journal Register Report.pdf';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  openTransaction(transaction: any) {
    if (transaction.type != 'Opening Balance') {
      if (transaction.type == 'Purchase') {
        this.router.navigateByUrl("/app/purchase/bills/edit/" + transaction.id);
      } else if (transaction.type == 'Sale Order') {
        this.router.navigateByUrl("/app/sale/order/edit/" + transaction.id);
      } else if (transaction.type == 'Payment-Out') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-out/" + transaction.id);
      } else if (transaction.type == 'Purchase Order') {
        this.router.navigateByUrl("/app/purchase/order/edit/" + transaction.id);
      } else if (transaction.type == 'Debit Note') {
        this.router.navigateByUrl("/app/purchase/debit-note/edit/" + transaction.id);
      } else if (transaction.type == 'Sale') {
        this.router.navigateByUrl("/app/sale/invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Credit Note') {
        this.router.navigateByUrl("/app/sale/credit-note/edit/" + transaction.id);
      } else if (transaction.type == 'POS') {
        this.router.navigateByUrl("/app/sale/pos_invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Tax Invoice') {
        this.router.navigateByUrl("/app/sale/tax-invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Service Invoice') {
        this.router.navigateByUrl("/app/sale/service_invoice/edit/" + transaction.id);
      } else if (transaction.type == 'Journal') {
        this.router.navigateByUrl("/app/other-entries/journal/edit/" + transaction.id);
      } else if (transaction.type == 'Service Invoice') {
        this.router.navigateByUrl("/app/sale/service_invoice/edit" + transaction.id);
      } else if (transaction.type == 'Payment-In') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-in/" + transaction.id);
      }
    }
  }
}
