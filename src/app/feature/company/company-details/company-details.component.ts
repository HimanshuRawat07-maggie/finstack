import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BusinessCategory, CompanyDetails, CompanyType, GstIn, State, getCompanyDetails } from 'src/app/core/api-models/company-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { CurrentUser } from 'src/app/core/models/user';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AppEvents } from 'src/app/core/models/appenums';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { DatePipe } from '@angular/common';
import { CompanySettings } from 'src/app/core/api-models/company-setting.model';
import { ImportDataModalComponent } from '../import-data-modal/import-data-modal.component';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  public settings: CompanySettings = {};
  profilePic: File | null = null;
  businessName: string = '';
  state: Array<State> = [];
  businessCategory: Array<BusinessCategory> = [];
  businessType: Array<BusinessCategory> = [];
  data: CompanyDetails = {};
  getData: getCompanyDetails = {};
  hasLogo: boolean = false;
  hasSignature: boolean = false;
  currentUser: CurrentUser;
  userPermissions: UserPermissions;
  constants = Constants;
  companyTypes: Array<CompanyType> = [];
  gstIn: GstIn = {};
  isCompanyFormVisible = true;

  @ViewChild('companyForm') companyForm?: any;
  constructor(private companyService: CompanyService, private toastr: ToastrService, private dialog: MatDialog,
    private httpClient: HttpClient, private appStateService: AppStateService, private datePipe: DatePipe) { }

  ngOnInit() {
    const set = this.companyService.getCompanySettings().subscribe(res => {
      this.settings = res.data;
      if (this.settings['finyear.startingfrom'] == null) {
        this.settings['finyear.startingfrom'] = this.datePipe.transform(new Date(), 'yyyy-04-01')!;
      }
      if (this.settings['book.startingfrom'] == null) {
        this.settings['book.startingfrom'] = this.datePipe.transform(new Date(), 'yyyy-04-01')!;
      }
      set.unsubscribe();
    });

    this.appStateService.currentUser().subscribe(res => {
      this.currentUser = res;
    });
    const sub = this.companyService.getAllStates().subscribe(res => {
      this.state = res.data
      sub.unsubscribe();
    });

    const type = this.companyService.getAllCompanyType().subscribe(res => {
      this.companyTypes = res.data;
      type.unsubscribe();
    });
    
    this.companyService.getBusinessCategory().subscribe(res => {
      this.businessCategory = res.data;
    });
    this.companyService.getAllBusinessType().subscribe(res => {
      this.businessType = res.data;
    });
    this.initCompanyDetails();
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Company, permissionValue);
  }

  hasPermissionForCompanySetting(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.CompanySettings, permissionValue);
  }

  initCompanyDetails(updateLogoInHeader = false) {
    this.companyService.getCompanyDetailsById().subscribe(res => {
      this.getData = res.data;
      this.data.name = this.getData.name;
      this.data.businessPhone = this.getData.businessPhone;
      this.data.businessEmail = this.getData.businessEmail;
      this.data.gst = this.getData.gst;
      this.data.tan = this.getData.tan;
      this.data.pan = this.getData.pan;
      this.data.businessTypeId = this.getData.businessTypeId;
      this.data.businessCategoryId = this.getData.businessCategoryId;
      this.data.billingAddress = this.getData.billingAddress?.address;
      this.data.businessDescription = this.getData.businessDescription;
      this.data.billingPincode = this.getData.billingAddress?.pincode;
      this.data.billingState = this.getData.billingAddress?.state.id;
      this.data.alternatePhone = this.getData.alternatePhone;
      this.data.msmeType = this.getData.msmeType;
      this.data.msmeRegistrationNumber = this.getData.msmeRegistrationNumber;
      this.data.cin = this.getData.cin;
      this.data.declaration = this.getData.declaration;

      if (this.getData.logo && this.getData.logo.length > 0) {
        this.hasLogo = true;
      } else {
        this.hasLogo = false;
      }

      if (updateLogoInHeader) {
        this.currentUser.companyName = this.getData.name;
        this.currentUser.companyLogoUrl = this.getData.logo;
        this.appStateService.sendEvent(AppEvents.SetUser, this.currentUser);
      }

      if (this.getData.signature && this.getData.signature.length > 0)
        this.hasSignature = true;
      else
        this.hasSignature = false;
    });
  }

  onFileChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      this.profilePic = e.target.files[0];
      // this.isFileSizeErrorVisible = this.validateFileSize(this.profilePic!)
      // this.isFileTypeErrorVisible = this.validateFileType();
      // if (this.isFileTypeErrorVisible == false) {
      //   alert("Accepted files types are .png, .jpg, .jpeg or .webp only")
      //   this.profilePic = null;
      // }
    }
  }

  onLogoChange(event: any) {
    let file = event.target.files[0];
    let formData: any = new FormData();
    formData.append('logo', file);
    this.httpClient.post(`${environment.apiEndpoint}company/logo/update`, formData).subscribe(res => {
      this.initCompanyDetails(true);
    })
  }

  onSignatureChange(event: any) {
    let file = event.target.files[0];
    let formData: any = new FormData();
    formData.append('signature', file);
    this.httpClient.post(`${environment.apiEndpoint}company/signature/update`, formData).subscribe(res => {
      this.initCompanyDetails();
    })
  }

  openImagePicker(id: string) {
    document.getElementById(id)?.click();
  }

  onSubmit() {
    if (this.isCompanyFormVisible) {
      this.companyForm.control.markAllAsTouched();
    }
    if (!this.companyForm.form.valid)
      return;

    if (this.data.businessCategoryId) {
      this.data.businessCategoryId = parseInt(this.data.businessCategoryId.toString(), 10);
    }
    if (this.data.businessTypeId) {
      this.data.businessTypeId = parseInt(this.data.businessTypeId.toString(), 10);
    }
    if (this.data.billingState) {
      this.data.billingState = parseInt(this.data.billingState.toString(), 10);
    }
    this.companyService.updateCompanyDetails(this.data).subscribe(res => {
      if (res.code == 200) {
        this.initCompanyDetails(true);
        this.toastr.success(res.message);
      }
    });
    const sub = this.companyService.saveCompanySettings(this.settings).subscribe(res => {
      if (res.code == 200) {
        // this.toastr.success('Data updated successfully');
        // this.settings = res.data;
        // this.updateLocalStorage();
         localStorage.setItem('minDate', this.settings['book.startingfrom']);
      }
      else {
        this.toastr.error(res.message)
      }
      sub.unsubscribe();
    });
  }

  openImportDataModal() {
    let dialogRef = this.dialog.open(ImportDataModalComponent, {
      width: '30%',
      autoFocus: false,
      data: {},
    });
  }


  removeLogo() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to remove company logo ?',
        title: 'Remove company logo'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        const sub = this.companyService.removeCompanyLogo().subscribe(res => {
          if (res.code == 200) {
            dialogRef.close(true);
            this.initCompanyDetails(true);
          } else {
            this.toastr.error(res.message);
          }
          sub.unsubscribe();
        });
      }
    });
  }


  removeSignature(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to remove this signature ?',
        title: 'Remove signature'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        const sub = this.companyService.removeSignature(id).subscribe(res => {
          if (res.code == 200) {
            dialogRef.close(true);
            this.initCompanyDetails()
          }
          else {
            this.toastr.error(res.message);
          }
          sub.unsubscribe();
        });
      }
    });
  }

  getGstInDetails() {
    if (this.data.gst) {
      const sub = this.companyService.getGstIn(this.data.gst).subscribe(res => {
        this.gstIn = res.data
        let idx = this.state.find(value => parseInt(value.code) === res.data.stateCode);
        this.data.billingState = idx.id
        this.data.billingPincode = res.data.addrPncd.toString()
        sub.unsubscribe();
      });
    }
  }

}
