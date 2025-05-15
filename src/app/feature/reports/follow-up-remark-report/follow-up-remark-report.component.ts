import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { FollowUpModalComponent } from '../follow-up-modal/follow-up-modal.component';
import { FollowUpReport } from 'src/app/core/api-models/report-model';
import { FollowUpHistoryComponent } from '../follow-up-history/follow-up-history.component';
import { Router } from '@angular/router';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-follow-up-remark-report',
  templateUrl: './follow-up-remark-report.component.html',
  styleUrls: ['./follow-up-remark-report.component.scss']
})
export class FollowUpRemarkReportComponent {
  data: Array<FollowUpReport> = [];
  bankid: number = 0;
  fromDate: string = '';
  toDate: string = '';

  constructor(private reportService: ReportService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }

  loadTableData() {
    const sub = this.reportService.getAllFollowUpRemarkRoprt(this.fromDate, this.toDate).subscribe(res => {
      this.data = res.data;
      this.data = this.data.filter(obj => obj.partyId !== null)
      sub.unsubscribe();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    this.loadTableData();
  }

  openModal(id: number, partyId: number) {
    let dialogRef = this.dialog.open(FollowUpModalComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        id: id,
        partyId: partyId
      },
    });
    dialogRef.componentInstance.confirmed.subscribe(res => {
      this.loadTableData();
    });
  }

  openFollowUpHistory(id: number, partyId: number) {
    let dialogRef = this.dialog.open(FollowUpHistoryComponent, {
      width: '50%',
      autoFocus: false,
      data: {
        id: id,
        partyId: partyId
      },
    });
  }

  download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportFollowUpRemarkReport
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Follow-Up Remark Report.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }


  downloadAsPdf(paperOrientation: string) {
    this.reportService.processing(true);
    let url = ApiUrl.exportFollowUpRemarkReportPdf;
    if (this.fromDate && this.toDate) {
      url = url + `${this.fromDate}&endDate=${this.toDate}&paperOrientation=${paperOrientation}`
    }
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'pdf' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Follow-Up Remark Report.pdf';
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
