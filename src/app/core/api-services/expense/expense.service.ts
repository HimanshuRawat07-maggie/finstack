import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Ledger, TransactionByLedgerId, Group, cashLedger } from '../../api-models/expense-model';
import { ApiUrl } from '../../constants/api-url-constant';
import { SalePurchaseApiModel } from '../../models/sale-purchase-template';
import { SaleInvoiceGetAll } from '../../api-models/sale-model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public getAllLedger(): Observable<BaseAPIResponseModel<Array<Ledger>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Ledger>>>(ApiUrl.getAllLedger).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllLedger', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllExpenseLedgers(): Observable<BaseAPIResponseModel<Array<Ledger>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Ledger>>>(ApiUrl.getAllExpenseLedgers).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllExpenseLedgers', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTransactionByLedgerId(id: number): Observable<BaseAPIResponseModel<Array<TransactionByLedgerId>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TransactionByLedgerId>>>(`${ApiUrl.getAllTransactionByLedgerId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTransactionByLedgerId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllJournals(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<TransactionByLedgerId>>> {
    this.processing(true);
    let url = ApiUrl.getAllJournals
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<TransactionByLedgerId>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllJournals', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }



  public saveLedger(details: Ledger): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Ledger, BaseAPIResponseModel<string>>(`${ApiUrl.saveLedger}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveLedger', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveGroup(details: Group): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Group, BaseAPIResponseModel<string>>(`${ApiUrl.saveGroup}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateGroup(details: Group): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Group, BaseAPIResponseModel<string>>(`${ApiUrl.updateGroup}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveJournal(details: SaleInvoiceGetAll): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SaleInvoiceGetAll, BaseAPIResponseModel<string>>(`${ApiUrl.saveJournal}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveJournal', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateJournal(order: SaleInvoiceGetAll): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SaleInvoiceGetAll, BaseAPIResponseModel<string>>(`${ApiUrl.updateJournal}`, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateJournal', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public updateCashOpeningBalance(data:cashLedger): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<cashLedger, BaseAPIResponseModel<string>>(`${ApiUrl.updateCashOpeningBalance}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateCashOpeningBalance', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public getCashOpeningbalance(): Observable<BaseAPIResponseModel<cashLedger>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<cashLedger>>(ApiUrl.getCashOpeningbalance).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCashOpeningbalance', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }



  public getGroups(): Observable<BaseAPIResponseModel<Array<Group>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Group>>>(ApiUrl.getGroups).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGroups', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public partyGroups(): Observable<BaseAPIResponseModel<Array<Group>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Group>>>(ApiUrl.partyGroups).pipe(
      catchError(err => {
        return throwError(() => this.handleError('partyGroups', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getJournalById(id: number): Observable<BaseAPIResponseModel<SaleInvoiceGetAll>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SaleInvoiceGetAll>>(`${ApiUrl.getJournalById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getJournalById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }




  public updateLedger(data: Ledger): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Ledger, BaseAPIResponseModel<string>>(`${ApiUrl.updateLedger}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateLedger', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }



  public deleteLedger(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteLedger}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteLedger', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteGroup(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteGroup}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteJournal(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteJournal}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteJournal', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


}
