import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { ApiUrl } from '../../constants/api-url-constant';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Warehouse } from '../../api-models/warehouse-model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public saveWarehouse(data: Warehouse): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Warehouse, BaseAPIResponseModel<string>>(`${ApiUrl.saveWarehouse}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveWarehouse', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllWarehouses(): Observable<BaseAPIResponseModel<Array<Warehouse>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Warehouse>>>(`${ApiUrl.getAllWarehouses}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllWarehouses', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateWarehouseDetail(data: Warehouse): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<Warehouse, BaseAPIResponseModel<string>>(`${ApiUrl.updateWarehouseDetail}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateWarehouseDetail', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getWarehouseById(id: number): Observable<BaseAPIResponseModel<Warehouse>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Warehouse>>(`${ApiUrl.getWarehouseById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getWarehouseById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteWarehouse(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteWarehouse}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteWarehouse', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
