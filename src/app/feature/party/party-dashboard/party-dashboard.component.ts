import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Party, PartyTransaction, getParty } from 'src/app/core/api-models/party-model';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { TransactionModalComponent } from '../../item/transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-party-dashboard',
  templateUrl: './party-dashboard.component.html',
  styleUrls: ['./party-dashboard.component.scss']
})
export class PartyDashboardComponent implements OnInit {
  data: Array<Party> = [];
  filteredData: Array<Party> = [];
  userPermissions: UserPermissions;
  constants = Constants;
  filterPartyText: string = ''
  colors: string[];

  constructor(private router: Router, private partyService: PartyService, private dialog: MatDialog, private toastr: ToastrService,
    private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    this.partyService.getAllParties().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      this.data.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      this.colors = this.generateRandomDarkColorsArray(this.data.length);
      this.data.forEach((x, idx) => x.pfpColor = this.colors[idx]);
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  openDeleteDialog(id: number, event: MouseEvent) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected Party?',
        title: 'Delete Party'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      
      if (res) {
        this.partyService.deletePartyById(id!).subscribe(response => {
          if (response.code == 200) {
            this.toastr.success('Party deleted successfully');
            this.loadTableData();
            dialogRef.close(true);
          } else {
            this.toastr.error(response.message)
          }
        });
      }
    });
  }

  getAmount(amount: number) {
    if (amount < 0) {
      amount = Math.abs(amount);
      return amount
    }
    return amount
  }

  filterParty() {
    if (this.filterPartyText?.length > 0) {
      let text = this.filterPartyText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)) ||
        (x.phone && x.phone.toLowerCase().includes(text))
      );
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

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Party, permissionValue);
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
      } else if (transaction.type == 'Payment-In') {
        this.router.navigateByUrl("/app/other-entries/edit-payment-in/" + transaction.id);
      }
    }
  }

  openTransactionModal(party: any) {
    let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
      data: {
        data: party,
        type: 'party'
      },
    });
  }

  openWhatsApp(phoneNumber: string): void {
    window.open("https://api.whatsapp.com/send?phone=" + phoneNumber);
  }

  generateInitials(name: string): string {
    const names = name.split(' ');
    let initials = '';
    names.forEach(name => {
      initials += name.charAt(0);
    });
    return initials.toUpperCase();
  }

  getRandomDarkColor(): string {
    const r = Math.floor(Math.random() * 128) + 100;
    const g = Math.floor(Math.random() * 128) + 70;
    const b = Math.floor(Math.random() * 128) + 128;
    const color = "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    return color;
  }

  componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  generateRandomDarkColorsArray(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(this.getRandomDarkColor());
    }
    return colors;
  }
}