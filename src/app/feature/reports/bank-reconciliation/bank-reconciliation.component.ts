import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/core/api-models/bank-model';
import { CashBook, ReconcileDate } from 'src/app/core/api-models/report-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html',
  styleUrls: ['./bank-reconciliation.component.scss']
})
export class BankReconciliationComponent {
  fromDate: string = '';
  toDate: string = '';
  data: Array<CashBook> = [];
  banks: Array<Bank> = [];
  bankid: number = 0;
  reconcileDate: Array<ReconcileDate> = [];
  isMisMatchAmountVisible = false;
  mismatchAmount: number = 0;
  companyBalance: number = 0;
  balanceAsPerBank: number = 0;
  minDate: string = '';

  constructor(private reportService: ReportService, private bankService: BankService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    const sub = this.bankService.getAllBankDetails().subscribe(res => {
      this.banks = res.data;
      sub.unsubscribe();
    });
  }

  loadTableData() {
    this.mismatchAmount = 0;
    this.balanceAsPerBank = 0;
    this.companyBalance = 0;
    const sub = this.reportService.getAllBankBookReport(this.fromDate, this.toDate, this.bankid).subscribe(res => {
      this.data = res.data;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].clearingDate == null) {
          if (this.data[i].cashIn) {
            this.mismatchAmount = this.data[i].cashIn + this.mismatchAmount;
          }
          else {
            this.mismatchAmount = this.data[i].cashOut + this.mismatchAmount;
          }
        }
        this.companyBalance = this.data[i].runningAmount;
      }
      this.balanceAsPerBank = this.companyBalance - this.mismatchAmount;
      this.data = this.data.filter(item => item.cashIn > 0 || item.cashOut > 0 || item.runningAmount > 0)
      let reconciledData = this.data.filter(item => item.clearingDate)
      for (let i = 0; i < reconciledData.length; i++) {
        this.reconcileDate.push({
          id: reconciledData[i].companyPartyTransactionId,
          clearingDate: reconciledData[i].clearingDate
        });
      }
      sub.unsubscribe();
    });
  }

  onDateChange(dates: any) {
    this.fromDate = dates.fromDate;
    this.toDate = dates.toDate;
    if (this.bankid > 0) {
      this.loadTableData();
    }
  }

  inputDate(id: number, date: string) {
    this.isMisMatchAmountVisible = false;
    let check = this.reconcileDate.findIndex(item => item.id === id)

    console.log(date);

    if (check >= 0) {
      this.reconcileDate[check].clearingDate = date;
    }
    else if (id && date && check == -1) {
      this.reconcileDate.push(
        {
          id: id,
          clearingDate: date
        }
      );
    }

  }

  reconcile() {
    this.mismatchAmount = 0;
    const sub = this.reportService.reconcile(this.reconcileDate).subscribe(res => {
      if (res.code == 200) {
        this.isMisMatchAmountVisible = true;
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].clearingDate == null) {
            if (this.data[i].cashIn) {
              this.mismatchAmount = this.data[i].cashIn + this.mismatchAmount;
            }
            else {
              this.mismatchAmount = this.data[i].cashOut + this.mismatchAmount;
            }
          }
        }
        this.balanceAsPerBank = this.companyBalance - this.mismatchAmount;
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }


   openTransaction(type: any,id:number) {
    let url = BusinessHelpers.openTransactionType(type);
    this.router.navigateByUrl(url+id)
  }

}
