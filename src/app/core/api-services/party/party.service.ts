import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { GetPartyById, Party, PartyGroup, PartyTransaction, UpdatePartyById, getParty } from '../../api-models/party-model';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ApiUrl } from '../../constants/api-url-constant';


@Injectable({
  providedIn: 'root'
})
export class PartyService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public getAllParties(): Observable<BaseAPIResponseModel<Array<Party>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Party>>>(ApiUrl.getAllParties).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllParties', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPartyGroups(): Observable<BaseAPIResponseModel<Array<PartyGroup>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyGroup>>>(ApiUrl.getPartyGroups).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPartyGroups', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSelectedPartyDetail(): Observable<BaseAPIResponseModel<Party>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Party>>(ApiUrl.getSelectedPartyDetail).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSelectedPartyDetail', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPartyById(id: number): Observable<BaseAPIResponseModel<GetPartyById>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<GetPartyById>>(`${ApiUrl.getPartyById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPartyById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPartyTransactionsById(id: number): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(`${ApiUrl.getPartyTransactionByPartyId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPartyTransactionsById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public checkPartyNameAvailablity(name: string): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(`${ApiUrl.checkPartyNameAvailablity}${name}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkPartyNameAvailablity', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public checkPartyAliasAvailablity(name: string): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(`${ApiUrl.checkPartyAliasAvailablity}${name}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkPartyAliasAvailablity', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public checkPartyCodeAvailablity(code: string): Observable<BaseAPIResponseModel<Array<PartyTransaction>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PartyTransaction>>>(`${ApiUrl.checkPartyCodeAvailablity}${code}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkPartyCodeAvailablity', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePartyById(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePartyById}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteProduct', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public saveParty(details: Party): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Party, BaseAPIResponseModel<string>>(`${ApiUrl.saveParty}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveParty', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateParty(data: UpdatePartyById): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<UpdatePartyById, BaseAPIResponseModel<string>>(`${ApiUrl.updateParty}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateParty', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
