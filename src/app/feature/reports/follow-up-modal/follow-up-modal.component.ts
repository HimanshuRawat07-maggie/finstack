import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Party } from 'src/app/core/api-models/party-model';
import { FollowUp } from 'src/app/core/api-models/report-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';

@Component({
  selector: 'app-follow-up-modal',
  templateUrl: './follow-up-modal.component.html',
  styleUrls: ['./follow-up-modal.component.scss']
})
export class FollowUpModalComponent implements OnInit {
  data: FollowUp = {};
  isFollowUpFormVisible = true;
  date: string = null;
  party: Party = {};
   minDate: string = '';

  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('FollowUpForm') FollowUpForm?: any;
  constructor(public dialogRef: MatDialogRef<FollowUpModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number, partyId: number },
    private datePipe: DatePipe, private toastr: ToastrService, private reportService: ReportService, private partyService: PartyService) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    const subs = this.partyService.getPartyById(this.details.partyId).subscribe(res => {
      this.party = res.data;
    });
    this.data.transactionId = this.details.id;
  }

  cancel() {
    this.dialogRef.close(true);
  }

  onSubmit() {
    if (this.isFollowUpFormVisible) {
      this.FollowUpForm.control.markAllAsTouched();
    }
    if (!this.FollowUpForm.form.valid)
      return;
    const enteredDate = new Date(this.data.followUpDate);
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const isPreviousDate: boolean = enteredDate > today;
    if (isPreviousDate) {
      const sub = this.reportService.saveFollowUp(this.data).subscribe(res => {
        if (res.code == 200) {
          this.confirmed.emit(true);
          this.cancel();
        }
        else {
          this.toastr.error(res.message)
        }
      })
    }
    else {
      this.toastr.error("Follow up date can't be previous date")
    }

  }

}
