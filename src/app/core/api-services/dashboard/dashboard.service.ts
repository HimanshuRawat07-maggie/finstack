import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { ApiUrl } from '../../constants/api-url-constant';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Graph } from '../../api-models/dashboard-model';
import { SaleInvoiceGetAll } from '../../api-models/sale-model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public getCashInHand(): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(`${ApiUrl.getCashInHand}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCashInHand', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getDashboardSaleData(todate:string,fromDate:string): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    let url = ApiUrl.getDashboardSaleData + `${fromDate}&endDate=${todate}`
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getDashboardSaleData', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getDashboardPurchaseData(todate:string,fromDate:string): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    let url = ApiUrl.getDashboardPurchaseData + `${fromDate}&endDate=${todate}`
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getDashboardPurchaseData', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCashInBank(): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(`${ApiUrl.getCashInBank}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCashInBank', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getExpenses(): Observable<BaseAPIResponseModel<any>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<any>>(`${ApiUrl.getExpenses}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getExpenses', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getReceivableAmount(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    let url = ApiUrl.getReceivableAmount
    if (startDate && endDate) {
      url = url + `?fromDate=${startDate}&toDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getReceivableAmount', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPayableAmount(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<number>> {
    this.processing(true);
    let url = ApiUrl.getPayableAmount
    if (startDate && endDate) {
      url = url + `?fromDate=${startDate}&toDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<number>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPayableAmount', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSaleForDashboard(startDate?: string, endDate?: string, period?: string): Observable<BaseAPIResponseModel<Array<Graph>>> {
    this.processing(true);
    let url = ApiUrl.getSaleForDashboard
    if (startDate && endDate) {
      url = url + `?fromDate=${startDate}&toDate=${endDate}&timePeriod=${period}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Graph>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleForDashboard', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPurchaseForDashboard(startDate?: string, endDate?: string, period?: string): Observable<BaseAPIResponseModel<Array<Graph>>> {
    this.processing(true);
    let url = ApiUrl.getPurchaseForDashboard
    if (startDate && endDate) {
      url = url + `?fromDate=${startDate}&toDate=${endDate}&timePeriod=${period}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Graph>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPurchaseForDashboard', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getExpenseForDashboard(startDate?: string, endDate?: string, period?: string): Observable<BaseAPIResponseModel<Array<Graph>>> {
    this.processing(true);
    let url = ApiUrl.getExpenseForDashboard
    if (startDate && endDate) {
      url = url + `?fromDate=${startDate}&toDate=${endDate}&timePeriod=${period}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Graph>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getExpenseForDashboard', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getRecentSales(): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(`${ApiUrl.getRecentSales}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getRecentSales', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getRecentPurchases(): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(`${ApiUrl.getRecentPurchases}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getRecentPurchases', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
}
