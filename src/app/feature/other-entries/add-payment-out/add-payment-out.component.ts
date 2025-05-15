import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/core/api-models/bank-model';
import { Party, PartyTransaction } from 'src/app/core/api-models/party-model';
import { PayemntIn } from 'src/app/core/api-models/sale-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { SalePurchase } from 'src/app/core/models/sale-purchase-template';
import { LinkPaymentComponent } from '../../sale/link-payment/link-payment.component';
import { Ledger } from 'src/app/core/api-models/expense-model';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-out',
  templateUrl: './add-payment-out.component.html',
  styleUrls: ['./add-payment-out.component.scss']
})
export class AddPaymentOutComponent implements OnInit {
  public constants = Constants;
  parties: Array<Party> = [];
  ledgers: Array<Ledger> = [];
  data: SalePurchase = {};
  paymentTypes: Array<Bank> = [];
  partyTransactions: Array<PartyTransaction> = [];
  showLinkPaymentBtn: boolean = false;
  partyId: number = NaN;
  prefix: string = '';
  suffix: string = '';
  partyAndLedger: Array<any> = [];
  selectedPartyLedger: any;
  status: string = 'Add'
  public cashOrBank = this.constants.Cash;
  check= {
    partyName: '',
    ledgerName:''
  }
   minDate: string = '';

  @ViewChild('paymentOutFrom') paymentOutFrom?: any;
  constructor(private partyService: PartyService, private route: ActivatedRoute, private expenseService: ExpenseService, private dialog: MatDialog, private datePipe: DatePipe, private saleService: SaleService, private toastr: ToastrService, private router: Router, private companyService: CompanyService, private bankService: BankService) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    const type = this.bankService.getAllBankDetails().subscribe(res => {
      this.paymentTypes = res.data;
      type.unsubscribe();
    });

    this.partyAndLedger = [];
    this.route.paramMap.subscribe(parameterMap => {
      let id = parameterMap.get('id');
      if (id != null) {
        this.status = 'Edit'
        const get = this.saleService.getPaymentOutById(parseInt(id)).subscribe(res => {
          this.data = res.data;
           if (this.data.ledgerName) {
            this.check.ledgerName = this.data.ledgerName;
          } else {
            this.check.partyName = this.data.partyName;
          }
          if (this.data.paymentMode != 'CASH') {
            this.cashOrBank = this.constants.Bank
          }

          const partySub = this.partyService.getAllParties().subscribe(res => {
            this.parties = res.data;
            const ledgerSub = this.expenseService.getAllLedger().subscribe(res => {
              this.ledgers = res.data;

              this.parties.forEach(party => {
                this.partyAndLedger.push({
                  id: party.id,
                  title: party.name,
                  email: party.email,
                  group: 'Party',
                  amount:party.amount
                });
              });
              this.ledgers.forEach(ledger => {
                this.partyAndLedger.push({
                  id: ledger.id,
                  title: ledger.name,
                  email: null,
                  group: 'Ledger',
                  amount:ledger.totalAmount
                });
              });

              this.partyAndLedger = [...this.partyAndLedger];

              if (this.data.partyName) {
                this.selectedPartyLedger = this.partyAndLedger.find(value => value.title == this.data.partyName && value.group == 'Party');
              } else {
                this.selectedPartyLedger = this.partyAndLedger.find(value => value.title == this.data.ledgerName && value.group == 'Ledger');
              }
              this.getTransactionById(true);
              ledgerSub.unsubscribe();
              partySub.unsubscribe();

            });
          });

          this.prefix = this.data.orderPrefix;
          this.suffix = this.data.orderSuffix;
          // this.partyService.getAllParties().subscribe(res => {
          //   this.parties = res.data;
          //   this.getTransactionById();
          // });
          get.unsubscribe();
        });
      } else {
        const partySub = this.partyService.getAllParties().subscribe(res => {
          this.parties = res.data;
          const ledgerSub = this.expenseService.getAllLedger().subscribe(res => {
            this.ledgers = res.data;

            this.parties.forEach(party => {
              this.partyAndLedger.push({
                id: party.id,
                title: party.name,
                email: party.email,
                group: 'Party',
                amount:party.amount
              });
            });
            this.ledgers.forEach(ledger => {
              this.partyAndLedger.push({
                id: ledger.id,
                title: ledger.name,
                email: null,
                group: 'Ledger',
                amount:ledger.totalAmount
              });
            });

            this.partyAndLedger = [...this.partyAndLedger];
            ledgerSub.unsubscribe();
            partySub.unsubscribe();

          });
        });
        this.data.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
        this.data.paymentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
        this.data.paymentMode = this.constants.Cash;
        const sub = this.partyService.getAllParties().subscribe(res => {
          this.parties = res.data;
          sub.unsubscribe();
        });
        const suff = this.companyService.getCompanySettingByKey('paymentout.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('paymentout.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });
        const billSub = this.saleService.getLatestOrderNumber(Constants.PaymentOut).subscribe(res => {
          this.data.orderNumber = res.data;
          billSub.unsubscribe();
        });
      }
    });
  }


      getNetAmount(amount: number | undefined | null) {
      if (amount == undefined || amount === null) {
       return 0;
    }   
    return Math.abs(amount);
  }

  onSubmit() {
   if (this.selectedPartyLedger == null) {
      this.toastr.error('Select Party/Ledger First');
      return;
    }
      if (this.data.amount==null|| this.data.amount <= 0) {
      this.toastr.error('Amount Should be greater than zero');
      return;
    }
    if (this.cashOrBank == this.constants.Cash) {
      this.data.paymentTypeId = null;
    }
    if (this.cashOrBank == this.constants.Bank && this.data.paymentTypeId==null) {
      this.toastr.error('Please select a Bank for the payment');
      return;
    }
    if (this.cashOrBank == this.constants.Bank && this.data.paymentMode==null) {
      this.toastr.error('Please select a Mode of Payment for the selected Bank');
      return;
    }
    if (this.selectedPartyLedger.group == "Party") {
      this.data.partyName = this.selectedPartyLedger.title;
    }
    else {
      this.data.ledgerId = this.selectedPartyLedger.id;
    }
    this.paymentOutFrom.control.markAllAsTouched();
    if (!this.paymentOutFrom.form.valid)
      return;

    this.data.orderNumber = this.data.orderNumber?.toString();
    if (this.data.id == null) {
      const sub = this.saleService.savePaymentOut(this.data).subscribe(res => {
        if (res.code == 200) {
          this.router.navigateByUrl('/app/other-entries/payment-out');
          this.toastr.success('Data saved successfully');
          this.openPdf(parseInt(res.data), this.data.orderPrefix, this.data.orderNumber, this.data.orderSuffix);
        } else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    }
    else {
      const sub = this.saleService.updatePaymentOut(this.data).subscribe(res => {
        if (res.code == 200) {
          this.router.navigateByUrl('/app/other-entries/payment-out');
          this.toastr.success('Data updated successfully');
          this.openPdf(parseInt(res.data), this.data.orderPrefix, this.data.orderNumber, this.data.orderSuffix);
        } else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    }
  }

  onCashOrBank() {
    if (this.cashOrBank === this.constants.Cash)
      this.data.paymentMode = this.constants.Cash;
    else
      this.data.paymentMode = this.constants.Cheque;
  }

  openLinkPayment() {
    let dialogRef = this.dialog.open(LinkPaymentComponent, {
      autoFocus: false,
      width: '70%',
      data: {
        name: this.selectedPartyLedger.title,
        transactions: this.partyTransactions,
        selectedTransaction: this.data.transactions,
        amount: this.data.amount
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.transactions?.length > 0) {
        this.data.transactions = [];
        let transactionsToAdd: Array<PartyTransaction> = res.transactions.filter((x: PartyTransaction) => x.selectedAmount > 0);
        transactionsToAdd.forEach(transaction => {
          this.data.transactions.push({
            transactionId: transaction.id,
            amount: transaction.selectedAmount
          });
        });
      }
      if (res?.amount) {
        this.data.amount = res.amount;
      }
    });
  }

  getTransactionById(check:boolean) {
    if (this.selectedPartyLedger == null) {
      let orderNo = this.data.orderNumber;
      let suffix = this.data.orderSuffix
      let prefix = this.data.orderPrefix
      let id = this.data.id
      this.data = {};
      this.data.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
      this.data.paymentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
      this.data.orderNumber = orderNo;
      this.showLinkPaymentBtn = false;
      this.data.orderPrefix = prefix
      this.data.orderSuffix = suffix
      this.data.id = id;
    }
    if (this.selectedPartyLedger.id && this.selectedPartyLedger?.group === 'Party') {
      let id = this.selectedPartyLedger.id;
        let partyOrLedgerId=this.data.id
      this.showLinkPaymentBtn = false;
         if (!check) {
        if (this.check.ledgerName&& this.check.ledgerName!=this.selectedPartyLedger.ritle) {
          partyOrLedgerId=null
        } else if (this.check.partyName && this.check.partyName != this.selectedPartyLedger.title) {
          partyOrLedgerId = 0;
        }
      }
      // this.data.partyId = this.parties?.find(x => x.name == this.data.partyName)?.id;
      const sub = this.saleService.unPaidPaymentOutByPartyId(this.selectedPartyLedger.id,partyOrLedgerId).subscribe(res => {
        if (res.code === 200) {
          this.partyTransactions = res.data;
          this.showLinkPaymentBtn = this.partyTransactions?.length > 0;
          // this.data.transactions = [];
        }
        sub.unsubscribe();
      });
    }
  }

  getSelectedTransactionMessage(): string {
    let message = '';
    if (this.data?.transactions?.length > 0) {
      return `${this.data.transactions.length} ${this.data.transactions.length === 1 ? 'transaction' : 'transactions'} linked`;
    }
    return message;
  }

  getUnusedAmount() {
    let totalReceived = 0;
    if (this.data?.transactions?.length > 0) {
      this.data.transactions.forEach(transaction => {
        if (transaction.amount > 0)
          totalReceived += transaction.amount;
      });
    }
    return (this.data.amount ?? 0) - totalReceived;
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
