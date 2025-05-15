import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { from } from 'rxjs';
import { DashboardSale } from 'src/app/core/api-models/dashboard-model';
import { TrialBalanceItem } from 'src/app/core/api-models/report-model';
import { SaleInvoiceGetAll } from 'src/app/core/api-models/sale-model';
import { DashboardService } from 'src/app/core/api-services/dashboard/dashboard.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { Constants } from 'src/app/core/constants/app-constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constants = Constants;
  receivableAmount: number = null;
  payableAmount: number = null;
  cashInHand: number = null;
  cashInBank: number = null;
  fromDate: string = '';
  toDate: string = '';

  fromSaleDate: string = '';
  toSaleDate: string = '';
  salePeriod: string = this.constants.Daily;
  totalSale: number = 0;
  sales: Array<SaleInvoiceGetAll> = [];

  fromPurchaseDate: string = '';
  toPurchaseDate: string = '';
  purchasePeriod: string = this.constants.Daily;
  totalPurchase: number = 0;
  purchases: Array<SaleInvoiceGetAll> = [];
  todaySale:DashboardSale={}
  thisMonthSale:DashboardSale={}
  lastMonthSale:DashboardSale={}
  yearlySale:DashboardSale={}
  todayPurchase:DashboardSale={}
  thisMonthPurchase:DashboardSale={}
  lastMonthPurchase:DashboardSale={}
  yearlyPurchase:DashboardSale={}

  public saleChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Total', fill: 'origin', backgroundColor: `rgba(0, 255, 0, 0.3)`, borderColor: '#19A855', pointBorderColor: '#fff', pointBackgroundColor: '#419c67' },
    ]
  };

  public purchaseChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Total', fill: 'origin', backgroundColor: `rgba(255, 0, 0, 0.3)`, borderColor: '#ff6384', pointBorderColor: '#fff', pointBackgroundColor: '#fd3761' },
    ]
  };

  public saleChartOptions: ChartConfiguration['options'];
  public purchaseChartOptions: ChartConfiguration['options'];
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  fromPnLDate: string = '';
  toPnLDate: string = '';
  public reportData: Array<TrialBalanceItem>;
  public indirectExpenses: Array<TrialBalanceItem>;
  public grossProfitLoss: Array<TrialBalanceItem>;
  public netProfitLoss: Array<TrialBalanceItem>;

  // expenseData: any;
  // fromExpenseDate: string = '';
  // toExpenseDate: string = '';
  // expensePeriod: string = this.constants.Daily;
  // totalExpense: number = 0;
  // public pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: 'bottom' }
  //   }
  // };
  // public pieChartLabels: Array<string> = [];
  // public pieChartDatasets: Array<any> = [{ data: [] }];
  // public paidPurchaseWidth: string = '';
  // public unpaidPurchaseWidth: string = '';
  // public paidInvoiceWidth: string = '';
  // public unpaidInvoiceWidth: string = '';

  constructor(private dashboardService: DashboardService, private datePipe: DatePipe, private router: Router, private reportService: ReportService) { }

  ngOnInit() {
    this.getSaleCardsDate();
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-01')!;
    const currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(currentDate.getDate() - 1);
    this.toDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;

    this.loadTableData();
    this.getSaleData();
    this.getPurchaseData();
    this.getPnLReport();
    // this.getExpenseData();
    // this.getRecentSales();
    // this.getRecentPurchases();
  }

  ngAfterViewInit() {
    let that = this;
    this.saleChartOptions = {
      responsive: true,
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        y: {
          position: 'left',
        }
      },
      plugins: {
        legend: { display: false },
      },
      onClick(event, elements, chart) {
        that.onSalesChartClick(event, elements, chart);
      },
    };

    this.purchaseChartOptions = {
      responsive: true,
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        y: {
          position: 'left',
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true
        }
      },
      onClick(event, elements, chart) {
        that.onPurchasesChartClick(event, elements, chart);
      },
    }
  }

  getSaleCardsDate() {
    let todaysDate = new Date();

    this.todaySale.fromDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
    this.todaySale.toDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
    this.todayPurchase.fromDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
    this.todayPurchase.toDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
      

    this.thisMonthSale.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1), 'yyyy-MM-dd')!;
    this.thisMonthSale.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0), 'yyyy-MM-dd')!;
    this.thisMonthPurchase.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1), 'yyyy-MM-dd')!;
    this.thisMonthPurchase.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0), 'yyyy-MM-dd')!;
    
    this.lastMonthSale.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 1, 1), 'yyyy-MM-dd')!;
    this.lastMonthSale.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 0), 'yyyy-MM-dd')!;
    this.lastMonthPurchase.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 1, 1), 'yyyy-MM-dd')!;
    this.lastMonthPurchase.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 0), 'yyyy-MM-dd')!;

      if (todaysDate.getMonth() >= 3 && todaysDate.getMonth() <= 11) {
          this.yearlySale.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 1), 'yyyy-MM-dd')!;
          this.yearlySale.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear() + 1, 3, 0), 'yyyy-MM-dd')!;
          this.yearlyPurchase.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 1), 'yyyy-MM-dd')!;
          this.yearlyPurchase.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear() + 1, 3, 0), 'yyyy-MM-dd')!;
        } else {
          this.yearlySale.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 3, 1), 'yyyy-MM-dd')!;
          this.yearlySale.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
          this.yearlyPurchase.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 3, 1), 'yyyy-MM-dd')!;
          this.yearlyPurchase.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
    }
    this.getSaleCardData(this.thisMonthSale.toDate,this.thisMonthSale.fromDate,'this month','Sale')
    this.getSaleCardData(this.todaySale.toDate,this.todaySale.fromDate,'today','Sale')
    this.getSaleCardData(this.lastMonthSale.toDate,this.lastMonthSale.fromDate,'last month','Sale')
    this.getSaleCardData(this.yearlySale.toDate,this.yearlySale.fromDate,'year','Sale')
    this.getSaleCardData(this.thisMonthPurchase.toDate,this.thisMonthSale.fromDate,'this month','Purchase')
    this.getSaleCardData(this.todayPurchase.toDate,this.todaySale.fromDate,'today','Purchase')
    this.getSaleCardData(this.lastMonthPurchase.toDate,this.lastMonthSale.fromDate,'last month','Purchase')
    this.getSaleCardData(this.yearlyPurchase.toDate,this.yearlySale.fromDate,'year','Purchase')
  }

  getSaleCardData(toDate:string,fromDate:string,type:string,transaction:string) {
    if (transaction=='Sale') {
      const sub = this.dashboardService.getDashboardSaleData(toDate, fromDate).subscribe(res => {
      if (type == 'today') {
        this.todaySale.data = res.data;
      } else if (type == 'this month') {
        this.thisMonthSale.data = res.data;
      } else if (type == 'last month') {
        this.lastMonthSale.data = res.data;
      } else if (type == 'year') {
        this.yearlySale.data = res.data;
      }
    });
   }
    else {
       const sub = this.dashboardService.getDashboardPurchaseData(toDate, fromDate).subscribe(res => {
      if (type == 'today') {
        this.todayPurchase.data = res.data;
      } else if (type == 'this month') {
        this.thisMonthPurchase.data = res.data;
      } else if (type == 'last month') {
        this.lastMonthPurchase.data = res.data;
      } else if (type == 'year') {
        this.yearlyPurchase.data = res.data;
      }
    });
   }
  }

  loadTableData() {
    const rec = this.dashboardService.getReceivableAmount(this.fromDate, this.toDate).subscribe(res => {
      this.receivableAmount = res.data;
      rec.unsubscribe();
    });
    const pay = this.dashboardService.getPayableAmount(this.fromDate, this.toDate).subscribe(res => {
      this.payableAmount = res.data;
      pay.unsubscribe();
    });
    const hand = this.dashboardService.getCashInHand().subscribe(res => {
      this.cashInHand = res.data;
      hand.unsubscribe();
    });
    const bank = this.dashboardService.getCashInBank().subscribe(res => {
      this.cashInBank = res.data;
      bank.unsubscribe();
    });
  }

  getSaleData() {
    if (this.fromSaleDate.length > 0 && this.toSaleDate.length > 0) {
      this.totalSale = 0;
      this.saleChartData.labels = [];
      this.saleChartData.datasets[0].data = [];
      const sub = this.dashboardService.getSaleForDashboard(this.fromSaleDate, this.toSaleDate, this.salePeriod).subscribe(res => {
        if (res?.data?.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (this.salePeriod === this.constants.Daily)
              this.saleChartData.labels.push(this.datePipe.transform(res.data[i].orderDate, 'dd-MM-yyyy')!);
            else if (this.salePeriod === this.constants.Monthly)
              this.saleChartData.labels.push(this.datePipe.transform(res.data[i].orderDate, 'MMM-yyyy')!);
            this.saleChartData.datasets[0].data.push(res.data[i].amount);
            this.totalSale = res.data[i].amount + this.totalSale;
          }
          this.charts.forEach((child) => {
            child.chart.update()
          });
        }
        sub.unsubscribe();
      });
    }
  }

  onSaleDateChange(dates: any) {
    this.fromSaleDate = dates.fromDate;
    this.toSaleDate = dates.toDate;
    let dateFormat = dates.dateFormat;
    switch (dateFormat) {
      case this.constants.ThisMonth:
      case this.constants.LastMonth:
        this.salePeriod = this.constants.Daily;
        break;

      case this.constants.ThisQuarter:
      case this.constants.ThisYear:
      case this.constants.LastQuarter:
      case this.constants.LastYear:
        this.salePeriod = this.constants.Monthly;
        break;
    }
    this.getSaleData();
  }

  onSalesChartClick(event: any, elements: Array<any>, chart: any) {
    if (elements?.length > 0) {
      let idx = elements[0].index;
      let date = '';
      if (this.salePeriod === this.constants.Daily) {
        date = `${this.saleChartData.labels[idx].toString().split('-')[2]}-${this.saleChartData.labels[idx].toString().split('-')[1]}-${this.saleChartData.labels[idx].toString().split('-')[0]}`;
      } else {
        date = `${this.saleChartData.labels[idx].toString()}`;
      }
      localStorage.setItem('date', date);
      this.router.navigateByUrl(`/app/report/sale`);
    }
  }

  getPurchaseData() {
    if (this.fromPurchaseDate.length > 0 && this.toPurchaseDate.length > 0) {
      this.totalPurchase = 0;
      this.purchaseChartData.labels = [];
      this.purchaseChartData.datasets[0].data = [];
      const sub = this.dashboardService.getPurchaseForDashboard(this.fromPurchaseDate, this.toPurchaseDate, this.purchasePeriod).subscribe(res => {
        if (res?.data?.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (this.purchasePeriod === this.constants.Daily)
              this.purchaseChartData.labels.push(this.datePipe.transform(res.data[i].orderDate, 'dd-MM-yyyy')!);
            else if (this.purchasePeriod === this.constants.Monthly)
              this.purchaseChartData.labels.push(this.datePipe.transform(res.data[i].orderDate, 'MMM-yyyy')!);
            this.purchaseChartData.datasets[0].data.push(res.data[i].amount);
            this.totalPurchase = res.data[i].amount + this.totalPurchase;
          }
          this.charts.forEach((child) => {
            child.chart.update()
          });
        }
        sub.unsubscribe();
      });
    }
  }

  onPurchaseDateChange(dates: any) {
    this.fromPurchaseDate = dates.fromDate;
    this.toPurchaseDate = dates.toDate;
    let dateFormat = dates.dateFormat;
    switch (dateFormat) {
      case this.constants.ThisMonth:
      case this.constants.LastMonth:
        this.purchasePeriod = this.constants.Daily;
        break;

      case this.constants.ThisQuarter:
      case this.constants.ThisYear:
      case this.constants.LastQuarter:
      case this.constants.LastYear:
        this.purchasePeriod = this.constants.Monthly;
        break;
    }
    this.getPurchaseData();
  }

  onPurchasesChartClick(event: any, elements: Array<any>, chart: any) {
    if (elements?.length > 0) {
      let idx = elements[0].index;
      let date = '';
      if (this.purchasePeriod === this.constants.Daily) {
        date = `${this.purchaseChartData.labels[idx].toString().split('-')[2]}-${this.purchaseChartData.labels[idx].toString().split('-')[1]}-${this.purchaseChartData.labels[idx].toString().split('-')[0]}`;
      } else {
        date = `${this.purchaseChartData.labels[idx].toString()}`;
      }
      localStorage.setItem('date', date);
      this.router.navigateByUrl(`/app/report/purchase`);
    }
  }

  getPnLReport() {
    if (this.fromPnLDate.length > 0 && this.toPnLDate.length > 0) {
      const sub = this.reportService.profitAndLoss(this.fromDate, this.toDate).subscribe(res => {
        this.reportData = res.data;
        this.reportData = this.reportData.filter(x => x);
        this.reportData = this.removePurchaseSaleAccount(this.reportData);
        this.reportData.forEach(x => {
          x.depth = 0;
          this.calcDepth(x);
        });
        this.addTotalFromChildren(this.reportData);

        this.indirectExpenses = this.reportData.filter(x => x.title === 'Indirect Expenses');
        this.reportData = this.reportData.filter(x => x.title != 'Indirect Expenses');

        let grossDebit = this.getTotalDebit(this.reportData);
        let grossCredit = this.getTotalCredit(this.reportData);

        if (grossCredit > grossDebit) {
          this.grossProfitLoss = [{
            children: [],
            creditAmount: grossCredit - grossDebit,
            debitAmount: 0,
            title: 'Gross Profit',
            depth: 0,
            isExpanded: true
          }];
        } else {
          this.grossProfitLoss = [{
            children: [],
            creditAmount: 0,
            debitAmount: grossDebit - grossCredit,
            title: 'Gross Loss',
            depth: 0,
            isExpanded: true
          }];
        }

        let netDebit = grossDebit + this.indirectExpenses[0].debitAmount;
        let netCredit = grossCredit + this.indirectExpenses[0].creditAmount;

        if (netCredit > netDebit) {
          this.netProfitLoss = [{
            children: [],
            creditAmount: netCredit - netDebit,
            debitAmount: 0,
            title: 'Net Profit',
            depth: 0,
            isExpanded: true
          }];
        } else {
          this.netProfitLoss = [{
            children: [],
            creditAmount: 0,
            debitAmount: netDebit - netCredit,
            title: 'Net Loss',
            depth: 0,
            isExpanded: true
          }];
        }

        sub.unsubscribe();
      });
    }
  }

  onProfitLossDateChange(dates: any) {
    this.fromPnLDate = dates.fromDate;
    this.toPnLDate = dates.toDate;
    this.getPnLReport();
  }

  removePurchaseSaleAccount(data: Array<TrialBalanceItem>): Array<TrialBalanceItem> {
    return data.filter(x => x.title != 'Purchase Account' && x.title != 'Sales Account');
  }

  addTotalFromChildren(data: Array<TrialBalanceItem>) {
    data.forEach(node => {
      if (node?.children?.length >= 0) {
        this.addTotalFromChildren(node.children);
        node.debitAmount += node.children.reduce((a, v) => a += Math.abs(v.debitAmount), 0);
        node.creditAmount += node.children.reduce((a, v) => a += Math.abs(v.creditAmount), 0);
      }
    })
  }

  calcDepth(node: TrialBalanceItem) {
    if (node.children)
      node.children.forEach(x => {
        x.depth = node.depth + 1;
        this.calcDepth(x);
      });
  }

  getTotalCredit(data: Array<TrialBalanceItem>): number {
    let total = 0;
    data.forEach(x => { total += x.creditAmount; });
    return total;
  }

  getTotalDebit(data: Array<TrialBalanceItem>): number {
    let total = 0;
    data.forEach(x => { total += x.debitAmount; });
    return total;
  }

  // getExpenseData() {
  //   this.totalExpense = 0;
  //   this.pieChartLabels = [];
  //   this.pieChartDatasets[0].data = [];
  //   const sub = this.dashboardService.getExpenses().subscribe(res => {
  //     this.expenseData = res.data;
  //     let keys = Object.keys(this.expenseData.ledgerWiseAmount);
  //     if (keys.length > 0) {
  //       keys.forEach(key => {
  //         this.pieChartLabels.push(key);
  //         this.pieChartDatasets[0].data.push(this.expenseData.ledgerWiseAmount[key]);
  //       });
  //     }
  //     this.charts.forEach((child) => {
  //       child.chart.update()
  //     });
  //     sub.unsubscribe();
  //   });
  // }

  // onExpenseDateChange(dates: any) {
  //   this.fromExpenseDate = dates.fromDate;
  //   this.toExpenseDate = dates.toDate;
  //   let dateFormat = dates.dateFormat;
  //   switch (dateFormat) {
  //     case this.constants.ThisMonth:
  //     case this.constants.LastMonth:
  //       this.expensePeriod = this.constants.Daily;
  //       break;

  //     case this.constants.ThisQuarter:
  //     case this.constants.ThisYear:
  //     case this.constants.LastQuarter:
  //     case this.constants.LastYear:
  //       this.expensePeriod = this.constants.Monthly;
  //       break;
  //   }
  //   this.getExpenseData();
  // }

  // getRecentSales() {
  //   this.paidInvoiceWidth = '0%';
  //   this.unpaidInvoiceWidth = '0%';
  //   const sub = this.dashboardService.getRecentSales().subscribe(res => {
  //     this.sales = res.data;
  //     let paid = 0, total = 0, unpaid = 0;
  //     this.sales.forEach(sale => {
  //       total += sale.amount;
  //       paid += sale.paidAmount;
  //     });
  //     unpaid = total - paid;
  //     this.paidInvoiceWidth = (paid / total * 100).toString() + '%';
  //     this.unpaidInvoiceWidth = (unpaid / total * 100).toString() + '%';
  //     sub.unsubscribe();
  //   });
  // }

  // getRecentPurchases() {
  //   this.paidPurchaseWidth = '0%';
  //   this.unpaidPurchaseWidth = '0%';
  //   const sub = this.dashboardService.getRecentPurchases().subscribe(res => {
  //     this.purchases = res.data;
  //     let paid = 0, total = 0, unpaid = 0;
  //     this.purchases.forEach(sale => {
  //       total += sale.amount;
  //       paid += sale.paidAmount;
  //     });
  //     unpaid = total - paid;
  //     this.paidPurchaseWidth = (paid / total * 100).toString() + '%';
  //     this.unpaidPurchaseWidth = (unpaid / total * 100).toString() + '%';
  //     sub.unsubscribe();
  //   });
  // }

  generateRandomData(numPoints: number): number[] {
    return Array.from({ length: numPoints }, () => Math.floor(Math.random() * 100));
  }


   chartType: ChartType = 'line';

  chartOptions: ChartOptions = {
    scales: {
      x: { beginAtZero: true },
      y: { display: false },
    },
     plugins: {
    legend: {
      display: false, // This hides the entire legend
    },
  },
  };
  chartLabels: any[] = ['', '', '', '', ''];

  chartDataCash: ChartData<'line'> = {
    labels: ['', '', '','',''],
    datasets: [
      {
        data: this.generateRandomData(this.chartLabels.length),
        fill: true, 
        backgroundColor: 'rgba(255, 184, 0, 0.5)', 
        borderColor: 'rgba(255, 184, 0, 1)', 
        borderWidth: 2,
        tension:0.5
      },
    ],
  };
  chartDataBank: ChartData<'line'> = {
    labels: ['', '', '','',''],
    datasets: [
      {
        data: this.generateRandomData(this.chartLabels.length),
        fill: true, 
        backgroundColor: 'rgba(66, 205, 255, 0.5)', 
        borderColor: 'rgba(66, 205, 255, 1)', 
        borderWidth: 2,
        tension:0.5
      },
    ],
  };
  chartDataReceivables: ChartData<'line'> = {
    labels: ['', '', '','',''],
    datasets: [
      {
        data: this.generateRandomData(this.chartLabels.length),
        fill: true, 
        backgroundColor: 'rgba(0, 255, 0, 0.5)', 
        borderColor: 'rgba(0, 255, 0, 1)', 
        borderWidth: 2,
        tension:0.5
      },
    ],
  };
  chartDataPayables: ChartData<'line'> = {
    labels: ['', '', '','',''],
    datasets: [
      {
        data: this.generateRandomData(this.chartLabels.length),
        fill: true, 
        backgroundColor: 'rgba(245, 85, 255, 0.5)', 
        borderColor: 'rgba(245, 85, 255, 1)', 
        borderWidth: 2,
        tension:0.5
      },
    ],
  };
}
