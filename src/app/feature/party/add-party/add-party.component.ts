import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BillingAddress, GetPartyById, Party, PartyGroup, UpdatePartyById } from 'src/app/core/api-models/party-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { BusinessCategory, GstIn, State } from 'src/app/core/api-models/company-model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss'],
})
export class AddPartyComponent implements OnInit {
  partyName: string = '';
  isToPayEnable = false;
  shippingAddress: BillingAddress = {};
  shippingAddressArray: Array<BillingAddress> = [];
  partyData: Party = {
    // partyGroup: 'DEBTORS',
    // shippingAddress: [{

    // }]
  };
  gstTypes: Array<BusinessCategory> = [];
  states: Array<State> = [];
  getParty: GetPartyById = {};
  payemntIn: boolean = false;
  updateParty: UpdatePartyById = {};
  status: string = 'Add';
  gstIn: GstIn = {};
  partyGroups: Array<PartyGroup> = [];
  isOpenedAsDialog: boolean = false;
   minDate: string = '';

  constructor(private datePipe: DatePipe, private dialog: MatDialog, private partyService: PartyService, private compnyService: CompanyService,
    private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private companyService: CompanyService,
    @Optional() private dialogRef: MatDialogRef<AddPartyComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
    if (this.dialogRef && this.data) {
      this.isOpenedAsDialog = true;
      if (this.data.partyName) {
        this.partyData.name = this.data.partyName;
      }
    }
  }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.partyData.asOfDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.route.paramMap.subscribe(parameterMap => {
      let caller = parameterMap.get('caller')
      if (caller == 'payment-In') {
        this.payemntIn = true;
      }

      let id = parameterMap.get('id');
      if (id != null && parseInt(id, 10) > 0) {
        this.status = 'Edit';
        this.partyService.getPartyById(parseInt(id, 10)).subscribe(res => {
          this.partyData = res.data;
          if (this.partyData) {
            // this.data.amount = Math.abs(this.getParty.openingBalance ?? 0);
            if (this.partyData.amount == 0)
              this.partyData.amount = null;
            if (this.partyData.asOfDate == null) {
              this.partyData.asOfDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
            }
            if (this.partyData.type == 'TO_RECEIVE') {
              this.isToPayEnable = false;
            }
            else {
              this.isToPayEnable = true;
            }
            if (this.partyData.billingAddress) {
              this.partyData.address = this.partyData.billingAddress.address;
              this.partyData.pincode = this.partyData.billingAddress.pincode;
              this.partyData.state = this.partyData.billingAddress.state?.id!;
            }
            if (this.partyData.gstTypeId) {
              this.partyData.gstType = this.partyData.gstTypeId;              
            }
            if (this.partyData.openingBalance) {
              if (this.partyData.openingBalance < 0) {
                this.partyData.openingBalance = Math.abs(this.partyData.openingBalance);                
              }
              else {
                this.partyData.openingBalance = this.partyData.openingBalance;
              }
            }
          }
        })
      }

      this.partyService.getPartyGroups().subscribe(res => {
        this.partyGroups = res.data;
        if (this.status === 'Add' && this.partyGroups?.length > 0) {
          this.partyData.partyGroupId = this.partyGroups[0].id.toString();
        }
      });
    });

    this.compnyService.getAllGstType().subscribe(res => {
      this.gstTypes = res.data;
    });
    this.compnyService.getAllStates().subscribe(res => {
      this.states = res.data;
    })
  }

  toggleCustomLimitField() {
    this.isToPayEnable = !this.isToPayEnable;
  }

  addShippingAddress() {
    this.partyData.shippingAddress?.push(this.shippingAddress);
    this.shippingAddress = {};
  }

  openDeleteDialog(i: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: {
        message: 'Are you sure want to delete the selected Adresss?',
        title: 'Delete Address'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        dialogRef.close();
        this.shippingAddressArray.splice(i, 1);
      }
    });
  }

  editAddress(i: number) {
    this.shippingAddress = this.partyData.shippingAddress![i]
    this.shippingAddressArray.splice(i, 1);
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  onSubmit(i: number) {
    if (!this.isToPayEnable) {
      this.partyData.type = 'TO_RECEIVE'
      this.updateParty.type = 'TO_RECEIVE'
    }
    else {
      this.partyData.type = 'TO_PAY'
      this.updateParty.type = 'TO_PAY'
    }
    this.updateParty.id = this.getParty.id
    this.updateParty.name = this.partyData.name;
    this.updateParty.gst = this.partyData.gst;
    this.updateParty.phone = this.partyData.phone;
    this.updateParty.email = this.partyData.email;
    this.updateParty.gstType = this.partyData.gstType;
    // this.updateParty.code = this.partyData.code;

    this.updateParty.gstState = this.partyData.gstState
    this.updateParty.address = this.partyData.address;
    this.updateParty.amount = this.partyData.amount;

    this.updateParty.asOfDate = this.datePipe.transform(this.partyData.asOfDate, 'yyyy-MM-dd')!;
    if (this.partyData.id == null) {
      this.partyService.saveParty(this.partyData).subscribe(res => {
        if (res.code == 200) {
          this.toastr.success('Data saved successfully');
          if (i == 0) {
            location.reload();
          } else {
            if (this.isOpenedAsDialog) {
              this.dialogRef.close(res.data);
            } else {
              if (this.payemntIn == true) {
                this.navigateTo('app/sale/add-payment-in');
              } else {
                this.navigateTo('app/party/dashboard');
              }
            }
          }
        }
        else {
          this.toastr.error(res.message);
        }
      });
    } else {
      this.partyService.updateParty(this.partyData).subscribe(res => {
        if (res.code == 200) {
          this.navigateTo('app/party/dashboard');
          this.toastr.success('Data updated successfully');
        }
        else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  close() {
    if (this.isOpenedAsDialog) {
      this.dialogRef.close();
    } else {
      this.router.navigateByUrl('/app/party/dashboard')
    }
  }

  partyNameAvailablity() {
    if (this.partyData.name != null) {
      const sub = this.partyService.checkPartyNameAvailablity(this.partyData.name).subscribe(res => {
        if (res.code != 200) {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      })
    }
  }

  partyCodeAvailablity() {
    if (this.partyData.code != null) {
      const sub = this.partyService.checkPartyCodeAvailablity(this.partyData.code).subscribe(res => {
        if (res.code != 200) {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      })
    }
  }

  partyAliasAvailablity() {
    if (this.partyData.alias != null) {
      const sub = this.partyService.checkPartyAliasAvailablity(this.partyData.alias).subscribe(res => {
        if (res.code != 200) {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      })
    }
  }

  getGstInDetails() {
    if (this.partyData.gst) {
      const sub = this.companyService.getGstIn(this.partyData.gst).subscribe(res => {
        this.gstIn = res.data
        let idx = this.states.find(value => parseInt(value.code) === res.data.stateCode);
        this.partyData.gstState = idx.name
        sub.unsubscribe();
      });
    }
  }

}
