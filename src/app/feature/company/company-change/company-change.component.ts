import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCompanyComponent } from '../add-company/add-company.component';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { CompanyDetails, GetAllCompany } from 'src/app/core/api-models/company-model';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AppEvents } from 'src/app/core/models/appenums';

@Component({
  selector: 'app-company-change',
  templateUrl: './company-change.component.html',
  styleUrls: ['./company-change.component.scss']
})
export class CompanyChangeComponent implements OnInit {
  data: Array<GetAllCompany> = [];
  companyId: number;
  company: CompanyDetails = {};
  isCompanyDetailBoxVisible = false;

  constructor(private dialog: MatDialog, private companyService: CompanyService, private authservice: AuthenticationService, private appStateService: AppStateService,) { }

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany() {
    const sub = this.companyService.getCompanies().subscribe(res => {
      this.data = res.data;
      sub.unsubscribe();
    })
    const selc = this.companyService.getCompanyDetailsById().subscribe(res => {
      this.companyId = res.data.id;
      selc.unsubscribe();
    });
  }

  toggleCompanyDetailBox() {
    this.isCompanyDetailBoxVisible = !this.isCompanyDetailBoxVisible
  }

  setCompanyId(id: number) {

  }

  openModal() {
    let dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '40%',
      autoFocus: false,
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadCompany();
        dialogRef.close(true);
      }
    });
  }

  switch() {
    const sub = this.companyService.companySwitch(this.companyId).subscribe(res => {
      this.company = res.data;
      this.authservice.token = res.data.token;
      this.appStateService.sendEvent(AppEvents.SetUser, res.data);
      this.appStateService.sendEvent(AppEvents.LoggedIn, true);
      // this.navigateTo('app/dashboard');
      sub.unsubscribe();
    });
  }
}
