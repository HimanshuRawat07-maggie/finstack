import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/core/api-models/bank-model';
import { Ledger } from 'src/app/core/api-models/expense-model';
import { Product } from 'src/app/core/api-models/item-model';
import { Party } from 'src/app/core/api-models/party-model';
import { SaleInvoiceGetAll } from 'src/app/core/api-models/sale-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.scss']
})

export class AddJournalComponent implements OnInit {
  public constants = Constants;
  parties: Array<Party> = [];
  ledgers: Array<Ledger> = [];
  paymentTypes: Array<Bank> = [];
  expenses: Array<Product> = [];
  partyLedgerAndPaymentType: Array<any> = [];
  addMaterialItem: Array<number> = [1];
  transactions: SaleInvoiceGetAll = {
    journals: [
      {
        journalEntryType: '',
        particularName: '',
        particularId: null,
        amount: null
      },
      {
        journalEntryType: '',
        particularName: '',
        particularId: null,
        amount: null
      },
    ]
  };
  prefix: string = '';
  suffix: string = '';
  status: string = 'Add';
   minDate: string = '';

  // debit: number = null;
  // credit: number = null;
  // selectedPartyLedgerAndPayment: any;


  constructor(private partyService: PartyService, private route: ActivatedRoute, private companyService: CompanyService, private router: Router,
    private saleService: SaleService, private datePipe: DatePipe, private bankService: BankService, private expenseService: ExpenseService,
    private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.partyLedgerAndPaymentType = [];

    this.route.paramMap.subscribe(parameterMap => {
      let id = parameterMap.get('id');
      if (id != null) {
        this.status = 'Edit';
        const sub = this.expenseService.getJournalById(parseInt(id)).subscribe(res => {
          this.transactions = res.data;
          this.suffix = this.transactions.orderSuffix;
          this.prefix = this.transactions.orderPrefix;
          for (let i = 0; i < this.transactions.journals.length; i++) {
            if (this.transactions.journals[i].journalEntryType == 'DEBIT') {
              this.transactions.journals[i].debit = this.transactions.journals[i].amount;
            } else {
              this.transactions.journals[i].credit = this.transactions.journals[i].amount;
            }
          }

          const partySub = this.partyService.getAllParties().subscribe(res => {
            this.parties = res.data;
            const ledgerSub = this.expenseService.getAllLedger().subscribe(res => {
              this.ledgers = res.data;
              const paymentSub = this.bankService.getAllBankDetails().subscribe(res => {
                this.paymentTypes = res.data;

                this.parties.forEach(party => {
                  this.partyLedgerAndPaymentType.push({
                    id: party.id,
                    title: party.name,
                    email: party.email,
                    group: 'Party'
                  });
                });
                this.ledgers.forEach(ledger => {
                  this.partyLedgerAndPaymentType.push({
                    id: ledger.id,
                    title: ledger.name,
                    email: null,
                    group: 'Ledger'
                  });
                });
                this.paymentTypes.forEach(payment => {
                  this.partyLedgerAndPaymentType.push({
                    id: payment.id,
                    title: payment.accountDisplayName,
                    email: null,
                    group: 'Payment'
                  });
                });
                this.partyLedgerAndPaymentType.push({
                  id: 0,
                  title: 'Cash',
                  email: null,
                  group: 'Payment'
                });

                this.partyLedgerAndPaymentType = [...this.partyLedgerAndPaymentType];
                for (let i = 0; i < this.transactions.journals.length; i++) {
                  if (this.transactions.journals[i].particularName == 'PARTY') {
                    this.transactions.journals[i].selectedPartyLedgerAndPayment = this.partyLedgerAndPaymentType.find(value => value.group === 'Party' && value.id == this.transactions.journals[i].particularId);
                  } else if (this.transactions.journals[i].particularName == 'LEDGER') {
                    this.transactions.journals[i].selectedPartyLedgerAndPayment = this.partyLedgerAndPaymentType.find(value => value.group === 'Ledger' && value.id == this.transactions.journals[i].particularId);
                  } else if (this.transactions.journals[i].particularName == 'PAYMENT_TYPE') {
                    this.transactions.journals[i].selectedPartyLedgerAndPayment = this.partyLedgerAndPaymentType.find(value => value.group === 'Payment' && value.id == this.transactions.journals[i].particularId);
                  } else if (this.transactions.journals[i].particularName == 'CASH') {
                    this.transactions.journals[i].selectedPartyLedgerAndPayment = this.partyLedgerAndPaymentType.find(value => value.group === 'Payment' && value.id == this.transactions.journals[i].particularId);
                  }
                }

                ledgerSub.unsubscribe();
                partySub.unsubscribe();
                paymentSub.unsubscribe();

              });
            });
          });

          sub.unsubscribe();
        });
      }
      else {
        const partySub = this.partyService.getAllParties().subscribe(res => {
          this.parties = res.data;
          const ledgerSub = this.expenseService.getAllLedger().subscribe(res => {
            this.ledgers = res.data;
            const paymentSub = this.bankService.getAllBankDetails().subscribe(res => {
              this.paymentTypes = res.data;

              this.parties.forEach(party => {
                this.partyLedgerAndPaymentType.push({
                  id: party.id,
                  title: party.name,
                  email: party.email,
                  group: 'Party'
                });
              });
              this.ledgers.forEach(ledger => {
                this.partyLedgerAndPaymentType.push({
                  id: ledger.id,
                  title: ledger.name,
                  email: null,
                  group: 'Ledger'
                });
              });
              this.paymentTypes.forEach(payment => {
                this.partyLedgerAndPaymentType.push({
                  id: payment.id,
                  title: payment.accountDisplayName,
                  email: null,
                  group: 'Payment'
                });
              });
              this.partyLedgerAndPaymentType.push({
                id: 0,
                title: 'CASH',
                email: null,
                group: 'Payment'
              });

              this.partyLedgerAndPaymentType = [...this.partyLedgerAndPaymentType];
              ledgerSub.unsubscribe();
              partySub.unsubscribe();
              paymentSub.unsubscribe();

            });
          });
        });
        this.transactions.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
        this.saleService.getLatestOrderNumber(this.constants.Journal).subscribe(res => {
          this.transactions.orderNumber = res.data;
        });
        const suff = this.companyService.getCompanySettingByKey('journal.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('journal.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });
      }
    });
  }

  addRow() {
    let netAmount = 0;
    this.transactions.journals.forEach(x => {
      if (x.credit)
        netAmount += x.credit;
      else if (x.debit)
        netAmount -= x.debit;
    });

    if (netAmount == 0) {
      this.transactions.journals.push({
        journalEntryType: '',
        particularName: '',
        particularId: null,
        debit: null,
        credit: null
      });
    } else if (netAmount > 0) {
      this.transactions.journals.push({
        journalEntryType: 'DEBIT',
        particularName: '',
        particularId: null,
        debit: Math.abs(netAmount),
        amount: Math.abs(netAmount),
        credit: null
      });
    } else if (netAmount < 0) {
      this.transactions.journals.push({
        journalEntryType: 'CREDIT',
        particularName: '',
        particularId: null,
        debit: null,
        credit: Math.abs(netAmount),
        amount: Math.abs(netAmount),
      });
    }


  }

  onSubmit() {
    if (this.getTotalCredit() != this.getTotalDebit()) {
      this.toastr.error('Total debit amount is not equal to total credit amount')
    }
    else {
      for (let i = 0; i < this.transactions.journals.length; i++) {
        if (this.transactions.journals[i].journalEntryType == '' &&this.transactions.journals.length>2) {
          this.transactions.journals.splice(i, 1)
        }
      }
      if (this.transactions.id == null) {
        if (this.transactions.journals.length>1 && this.transactions.journals[0].journalEntryType!=''&& this.transactions.journals[1].journalEntryType!='') {
          const sub = this.expenseService.saveJournal(this.transactions).subscribe(res => {
          if (res.code == 200) {
            this.router.navigateByUrl('/app/other-entries/journal');
            this.toastr.success('Data saved successfully');
            this.openPdf(parseInt(res.data), this.transactions.orderPrefix, this.transactions.orderNumber, this.transactions.orderSuffix);
          }
          sub.unsubscribe();
        });
     }
      }
      else {
        const sub = this.expenseService.updateJournal(this.transactions).subscribe(res => {
          if (res.code == 200) {
            this.router.navigateByUrl('/app/other-entries/journal');
            this.toastr.success('Data updated successfully');
            this.openPdf(parseInt(res.data), this.transactions.orderPrefix, this.transactions.orderNumber, this.transactions.orderSuffix);
          }
          sub.unsubscribe();
        });
      }
    }
  }

  getTotalDebit(): number {
    return this.transactions.journals.reduce((total, transaction) => {
      return transaction.journalEntryType === 'DEBIT' ? total + (transaction.amount || 0) : total;
    }, 0);
  }

  getTotalCredit(): number {
    return this.transactions.journals.reduce((total, transaction) => {
      return transaction.journalEntryType === 'CREDIT' ? total + (transaction.amount || 0) : total;
    }, 0);
  }

  deleteRow(index: number) {
    this.transactions.journals.splice(index, 1)
  }

  clearDebit(idx: number) {
    this.transactions.journals[idx].journalEntryType = 'CREDIT'
    this.transactions.journals[idx].amount = this.transactions.journals[idx].credit;
    this.transactions.journals[idx].debit = null;
  }

  clearCredit(idx: number) {
    this.transactions.journals[idx].journalEntryType = 'DEBIT'
    this.transactions.journals[idx].amount = this.transactions.journals[idx].debit;
    this.transactions.journals[idx].credit = null;
  }

  setParticularNameAndId(idx: number, data: any) {
    if (data) {
      if (data.group == 'Party') {
        this.transactions.journals[idx].particularName = 'PARTY';
      } else if (data.group == 'Ledger') {
        this.transactions.journals[idx].particularName = 'LEDGER';
      } else if (data.group == 'Payment') {
        if (data.title == 'CASH') {
          this.transactions.journals[idx].particularName = 'CASH';
        }
        else {
          this.transactions.journals[idx].particularName = ' PAYMENT_TYPE';
        }
      }
      this.transactions.journals[idx].particularId = data.id;
    }
  }

  pdfURL: SafeUrl;
  openPdf(id: number, prefix: string, orderNo: string, suffix: string) {
    this.saleService.processing(true);
    this.saleService.openPdf(id).subscribe({
      next: res => {
        this.saleService.processing(false);
        this.dialog.open(PdfModalComponent, {
          width: '90%',
          height: '90%',
          autoFocus: false,
          data: {
            res: res,
            prefix: prefix,
            orderNo: orderNo,
            suffix: suffix
          },
        });
      },
      error: err => {
        this.saleService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });
  }
}
