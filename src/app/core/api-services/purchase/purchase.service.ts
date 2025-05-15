import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { SalePurchaseApiModel } from '../../models/sale-purchase-template';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { ApiUrl } from '../../constants/api-url-constant';
import { DebitNote } from '../../api-models/purchase';
import { SaleOrderGetAll } from '../../api-models/sale-model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public savePurchaseReturn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.savePurchaseReturn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePurchaseReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePurchaseBills(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.savePurchaseBills, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePurchaseBills', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePurchaseAsset(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.savePurchaseAsset, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePurchaseAsset', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePurchaseBills(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updatePurchaseBills, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePurchaseBills', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePurchaseAssets(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updatePurchaseAssets, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePurchaseAssets', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePurchaseOrder(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updatePurchaseOrder, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePurchaseOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateChallanIn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateChallanIn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateChallanIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePurchaseReturn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updatePurchaseReturn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePurchaseReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePurchaseOrder(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.savePurchaseOrder, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePurchaseOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveChalanIn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveChalanIn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveChalanIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllDebitNote(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = ApiUrl.getAllDebitNote
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllDebitNote', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getDebitNoteById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getDebitNoteById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getDebitNoteById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPurchaseOrderById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getPurchaseOrderById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPurchaseOrderById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getChallanInById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getChallanInById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getChallanInById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPurchaseBillById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getPurchaseBillById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPurchaseBillById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPurchaseAssetById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getPurchaseAssetById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPurchaseAssetById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPurchaseBills(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = ApiUrl.getAllPurchaseBills
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPurchaseBills', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPurchaseAsset(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = ApiUrl.getAllPurchaseAsset
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPurchaseAsset', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPurchaseOrders(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = ApiUrl.getAllPurchaseOrders
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPurchaseOrders', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllChallanIn(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = ApiUrl.getAllChallanIn
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllChallanIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePurchaseBill(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePurchaseBill}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePurchaseBill', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePurchaseAsset(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePurchaseAsset}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePurchaseAsset', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePurchaseReturn(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePurchaseReturn}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePurchaseReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePurchaseOrder(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePurchaseOrder}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePurchaseOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteChallanIn(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteChallanIn}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteChallanIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPendingPurchaseOrderByPartyId(id: number,isChallan:boolean): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(`${ApiUrl.getPendingPurchaseOrderByPartyId}${id}&includeChallans=${isChallan}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPendingPurchaseOrderByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompletedPurchaseByPartyId(id: number): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(`${ApiUrl.getCompletedPurchaseByPartyId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompletedPurchaseByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
