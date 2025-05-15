import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { WebApiService } from '../../services/web-api.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { AppBaseService } from '../base/base.service';
import { ApiUrl } from '../../constants/api-url-constant';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CashBook, DayBookReport, FollowUp, FollowUpReport, GSTR1, GroupReport, GroupWiseTransaction, ItemWiseAgeing, JournalReport, LedgerReportTransaction, LogHistory, PurchaseReport, ReceivableReport, ReconcileDate, StockJournalReport, StockSummary, StockSummaryReport, Tds, TrialBalanceItem } from '../../api-models/report-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PartyTransaction } from '../../api-models/party-model';
import { TransactionByLedgerId } from '../../api-models/expense-model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends AppBaseService {


  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService,
    private http: HttpClient) {
    super(broadcaster, appStateService);
  }

    public getTdsReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<Tds>>> {
    this.processing(true);
    let url = ApiUrl.getTdsReport
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Tds>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getTdsReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveFollowUp(details: FollowUp): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<FollowUp, BaseAPIResponseModel<string>>(`${ApiUrl.saveFollowUp}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveFollowUp', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getGstR1Report(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<GSTR1>>> {
    this.processing(true);
    let url = ApiUrl.getGstR1Report
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GSTR1>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGstR1Report', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getGstR2Report(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<GSTR1>>> {
    this.processing(true);
    let url = ApiUrl.getGstR2Report
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GSTR1>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGstR2Report', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllFollowUpRemark(id: number): Observable<BaseAPIResponseModel<Array<FollowUp>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<FollowUp>>>(`${ApiUrl.getAllFollowUpRemark}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllFollowUpRemark', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTransactionByLedgerReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<LedgerReportTransaction>>> {
    this.processing(true);
    let url = ApiUrl.getAllTransactionByLedgerReport;
    if (startDate && endDate && id) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<LedgerReportTransaction>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTransactionByLedgerReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTransactionByPartyWiseReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<LedgerReportTransaction>>> {
    this.processing(true);
    let url = ApiUrl.getAllTransactionByPartyWiseReport;
    if (startDate && endDate && id) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<LedgerReportTransaction>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTransactionByPartyReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTransactionByGroupReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<GroupWiseTransaction>>> {
    this.processing(true);
    let url = ApiUrl.getAllTransactionByGroupReport;
    if (startDate && endDate && id) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GroupWiseTransaction>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTransactionByGroupReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTransactionByPartyReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    let url = ApiUrl.getAllTransactionByPartyReport;
    if (startDate && endDate && id) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTransactionByPartyReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllReceivable(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<ReceivableReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllReceivable
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ReceivableReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllReceivable', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPayable(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<ReceivableReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPayable
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ReceivableReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPayable', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllReceiptRegister(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<ReceivableReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllReceiptRegister
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ReceivableReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllReceiptRegister', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPaymentRegister(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<ReceivableReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPaymentRegister
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ReceivableReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPaymentRegister', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllStockSummary(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<StockSummary>>> {
    this.processing(true);
    let url = ApiUrl.getAllStockSummary
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<StockSummary>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllStockSummary', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllManufacturedProductReport(startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<StockSummaryReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllManufacturedProductReport
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<StockSummaryReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllManufacturedProductReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPurchaseReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPurchaseReport
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPurchaseReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllSalesReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllSalesReport
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSalesReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllSalesOrderReport(id: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllSalesOrderReport;
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSalesOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPurchaseOrderReport(id: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPurchaseOrderReport
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPurchaseOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  public getAllPendingSaleOrderReport(id: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPendingSaleOrderReport
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPendingSaleOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPendingPurchaseOrderReport(id: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PurchaseReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllPendingPurchaseOrderReport
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PurchaseReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPendingPurchaseOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllCashBookReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<CashBook>>> {
    this.processing(true);
    let url = ApiUrl.getAllCashBookReport
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<CashBook>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllCashBookReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getLogHistoryReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<LogHistory>>> {
    this.processing(true);
    let url = ApiUrl.getLogHistoryReport
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<LogHistory>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getLogHistoryReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getStockJournalReport(itemId?: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<StockJournalReport>>> {
    this.processing(true);
    let url = ApiUrl.getStockJournalReport
    if (startDate && endDate) {
      url = url + `${itemId}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<StockJournalReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getStockJournalReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getItemWiseAgigngReport(): Observable<BaseAPIResponseModel<Array<ItemWiseAgeing>>> {
    this.processing(true);
    let url = ApiUrl.getItemWiseAgeingReport
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ItemWiseAgeing>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllCashBookReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getJournalReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<JournalReport>>> {
    this.processing(true);
    let url = ApiUrl.getJournalReport
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<JournalReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getJournalReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  // public getAllStockSummary(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<CashBook>>> {
  //   this.processing(true);
  //   let url = ApiUrl.getAllStockSummary
  //   if (startDate && endDate) {
  //     url = url + `?startDate=${startDate}&endDate=${endDate}`
  //   }
  //   return this.webApiService.GetApi<BaseAPIResponseModel<Array<CashBook>>>(url).pipe(
  //     catchError(err => {
  //       return throwError(() => this.handleError('getAllCashBookReport', err));
  //     }))
  //     .pipe(
  //       tap((response) => {
  //         this.processing(false);
  //       }),
  //     );
  // }

  public getAllBankBookReport(startDate?: string, endDate?: string, id?: number): Observable<BaseAPIResponseModel<Array<CashBook>>> {
    this.processing(true);
    let url = ApiUrl.getAllBankBookReport
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}&companyPaymentTypeId=${id}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<CashBook>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBankBookReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getTransactionByTax(startDate?: string, endDate?: string, tax?: string): Observable<BaseAPIResponseModel<Array<any>>> {
    this.processing(true);
    let url = ApiUrl.getTransactionByTax
    if (startDate && endDate) {
      url = url + `${tax}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<any>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBankBookReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllFollowUpRemarkRoprt(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<FollowUpReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllFollowUpRemarkRoprt
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<FollowUpReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllFollowUpRemarkRoprt', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllGroupSummaryReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<GroupReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllGroupSummaryReport
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GroupReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPendingPurchaseOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllItemWiseMovementReport(id: number, startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<GroupReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllItemWiseMovementReport;
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}&productId=${id}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GroupReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllItemWiseMovementReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPartyWiseOutstandingReport(id?: number): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(`${ApiUrl.getPartyWiseOutstandingReport}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPartyWiseOutstandingReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllWarehouseSummaryReport(id: number, startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<GroupReport>>> {
    this.processing(true);
    let url = ApiUrl.getAllWarehouseSummaryReport
    if (startDate && endDate) {
      url = url + `${id}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GroupReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPendingPurchaseOrderReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public getExpiredProductReport(startDate?: string, endDate?: string, type?: string): Observable<BaseAPIResponseModel<Array<GroupReport>>> {
    this.processing(true);
    let url = ApiUrl.getExpiredProductReport
    if (startDate && endDate) {
      url = url + `${type}&startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GroupReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getExpiredProductReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getDayBookReport(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DayBookReport>>> {
    this.processing(true);
    let url = ApiUrl.getDayBookReport
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DayBookReport>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getDayBookReport', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public downloadReport(url: string): Observable<Blob> {
    this.processing(true);
    return this.http.get(environment.apiEndpoint + url, {
      responseType: 'blob'
    });
  }

  public reconcile(data: Array<ReconcileDate>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<Array<ReconcileDate>, BaseAPIResponseModel<string>>(ApiUrl.reconcile, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('reconcile', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public trialBalance(startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<TrialBalanceItem>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TrialBalanceItem>>>(`${ApiUrl.trialBalance}?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('trialBalance', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public profitAndLoss(startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<TrialBalanceItem>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TrialBalanceItem>>>(`${ApiUrl.profitLoss}?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('profitAndLoss', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public incomeAndExpenditure(startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<TrialBalanceItem>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TrialBalanceItem>>>(`${ApiUrl.incomeAndExpenditure}?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('incomeAndExpenditure', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public balanceSheet(startDate: string, endDate: string): Observable<BaseAPIResponseModel<Array<TrialBalanceItem>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TrialBalanceItem>>>(`${ApiUrl.balanceSheet}?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('balanceSheet', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public downloadPdf(divId: string, fileName: string, companyDetails: { name: string, address: string, state: string, pincode: string }, reportName: string, dateString: string) {
    const element = document.getElementById(divId);

    html2canvas(element, { scrollX: 0, scrollY: -window.scrollY }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 170; // Adjusted width considering the padding
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const fontSize = 15; // Base font size for text

      let positionX = 20; // X-axis padding
      let positionY = 0;

      // Add company name centered at the top
      positionY += 10;
      const companyName = companyDetails.name;
      const companyNameWidth = pdf.getStringUnitWidth(companyName) * fontSize / pdf.internal.scaleFactor;
      const companyNameX = (pdf.internal.pageSize.getWidth() - companyNameWidth) / 2;
      pdf.setFontSize(fontSize);
      pdf.text(companyName, companyNameX, 10);

      // Add company address centered below company name
      positionY += 5; // Move down from company name
      const companyAddress = companyDetails.address;
      const companyAddressWidth = pdf.getStringUnitWidth(companyAddress) * (fontSize - 2) / pdf.internal.scaleFactor;
      const companyAddressX = (pdf.internal.pageSize.getWidth() - companyAddressWidth) / 2;
      pdf.setFontSize(fontSize - 5); // Decrease font size for address
      pdf.text(companyAddress, companyAddressX, positionY);

      // Add company address centered below company name
      positionY += 5;
      const companyState = companyDetails.state;
      const companyStateWidth = pdf.getStringUnitWidth(companyState) * (fontSize - 5) / pdf.internal.scaleFactor;
      const companyStateX = (pdf.internal.pageSize.getWidth() - companyStateWidth) / 2;
      pdf.setFontSize(fontSize - 5);
      pdf.text(companyState, companyStateX, positionY);

      positionY += 5;
      const companyPincode = companyDetails.pincode;
      const companyPincodeWidth = pdf.getStringUnitWidth(companyPincode) * (fontSize - 5) / pdf.internal.scaleFactor;
      const companyPincodeX = (pdf.internal.pageSize.getWidth() - companyPincodeWidth) / 2;
      pdf.setFontSize(fontSize - 5);
      pdf.text(companyPincode, companyPincodeX, positionY);

      positionY += 10;
      const reportNameWidth = pdf.getStringUnitWidth(reportName) * fontSize / pdf.internal.scaleFactor;
      const reportNameX = (pdf.internal.pageSize.getWidth() - reportNameWidth) / 2;
      pdf.setFontSize(fontSize);
      pdf.text(reportName, reportNameX, positionY);


      positionY += 5;
      const dateStringWidth = pdf.getStringUnitWidth(dateString) * (fontSize - 5) / pdf.internal.scaleFactor;
      const dateStringX = (pdf.internal.pageSize.getWidth() - dateStringWidth) / 2;
      pdf.setFontSize(fontSize - 5);
      pdf.text(dateString, dateStringX, positionY);

      // Add HTML section below the date string
      positionY += 10; // Move down from date string
      pdf.addImage(imgData, 'PNG', positionX, positionY, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add remaining pages
      while (heightLeft >= 0) {
        positionY = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', positionX, positionY, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName + '.pdf');
    });
  }










}
