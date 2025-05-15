import { Injectable } from '@angular/core';
import { AppBaseService } from '../base/base.service';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { Bank, BankTransaction } from '../../api-models/bank-model';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { ApiUrl } from '../../constants/api-url-constant';

@Injectable({
  providedIn: 'root'
})
export class BankService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public saveBankDetails(data: FormData): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<FormData, BaseAPIResponseModel<string>>(`${ApiUrl.saveBankDetails}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveBankDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public setDefaultBank(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
      return this.webApiService.PutApi<FormData, BaseAPIResponseModel<string>>(`${ApiUrl.setDefaultBank}${id}`, null).pipe(
        catchError(err => {
          return throwError(() => this.handleError('setDefaultBank', err));
        }))
        .pipe(
          tap((response) => {
            this.processing(false);
          }),
        )
  }

  public updateBankDetails(data: FormData): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<FormData, BaseAPIResponseModel<string>>(`${ApiUrl.updateBankDetails}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateBankDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllBankDetails(): Observable<BaseAPIResponseModel<Array<Bank>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Bank>>>(`${ApiUrl.getAllBankDetails}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBankDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllBankDetailById(id: number): Observable<BaseAPIResponseModel<Bank>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Bank>>(`${ApiUrl.getAllBankDetailById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBankDetailById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllBankTransactionsById(id: number): Observable<BaseAPIResponseModel<Array<BankTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<BankTransaction>>>(`${ApiUrl.transactionsByPaymentTypeId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBankTransactionsById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteBank(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteBank}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteBank', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
