import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Party } from 'src/app/core/api-models/party-model';
import { FollowUp } from 'src/app/core/api-models/report-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';

@Component({
  selector: 'app-follow-up-history',
  templateUrl: './follow-up-history.component.html',
  styleUrls: ['./follow-up-history.component.scss']
})
export class FollowUpHistoryComponent implements OnInit {
  data: Array<FollowUp> = [];
  party: Party = {}

  constructor(public dialogRef: MatDialogRef<FollowUpHistoryComponent>, @Inject(MAT_DIALOG_DATA) public details: { id: number, partyId: number },
    private partyService: PartyService, private reportService: ReportService) { }

  ngOnInit() {
    const sub = this.reportService.getAllFollowUpRemark(this.details.id).subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    })
    const subs = this.partyService.getPartyById(this.details.partyId).subscribe(res => {
      this.party = res.data;
    });
  }

  close() {
    this.dialogRef.close(true);
  }
}
