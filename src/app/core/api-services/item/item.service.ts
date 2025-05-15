import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Item, Product, SaveProductStock, Unit, GstSlab, HsnCode, AdjustItem, ItemWithDetails, ManufactureAdjustItem } from '../../api-models/item-model';
import { ApiUrl } from '../../constants/api-url-constant';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { updatePriceListDto } from '../../api-models/item-group';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public getAllItems(): Observable<BaseAPIResponseModel<Array<Item>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Item>>>(ApiUrl.getAllItems).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllItems', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public getProductByBarcode(barcode:string): Observable<BaseAPIResponseModel<Array<ItemWithDetails>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ItemWithDetails>>>(`${ApiUrl.getProductByBarcode}${barcode}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getProductByBarcode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllItemsWithoutBarcode(): Observable<BaseAPIResponseModel<Array<Item>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Item>>>(ApiUrl.getAllItemsWithoutBarcode).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllItemsWithoutBarcode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllItemsWithDetails(): Observable<BaseAPIResponseModel<Array<ItemWithDetails>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ItemWithDetails>>>(ApiUrl.getAllItemsWithDetails).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllItemsWithDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getItemsWithBarcode(): Observable<BaseAPIResponseModel<Array<ItemWithDetails>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ItemWithDetails>>>(ApiUrl.getItemsWithBarcode).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getItemsWithBarcode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllUnit(): Observable<BaseAPIResponseModel<Array<Unit>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Unit>>>(ApiUrl.getAllUnit).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllUnit', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllSlab(): Observable<BaseAPIResponseModel<Array<GstSlab>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GstSlab>>>(ApiUrl.getAllSlab).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSlab', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllStorageCategory(): Observable<BaseAPIResponseModel<Array<string>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<string>>>(ApiUrl.getAllStorageCategory).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSlab', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getByProductId(id: number): Observable<BaseAPIResponseModel<Array<Product>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<Product>>>(`${ApiUrl.getByProductId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getByProductId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getHsnCode(id: string): Observable<BaseAPIResponseModel<Array<HsnCode>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<HsnCode>>>(`${ApiUrl.getHsnCode}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getHsnCode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public checkItemNameAvailablity(name: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(`${ApiUrl.checkItemNameAvailablity}${name}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkItemNameAvailablity', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public checkItemAliasAvailablity(code: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(`${ApiUrl.checkItemAliasAvailablity}${code}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkItemCodeAvailablity', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public assignCode(): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(`${ApiUrl.assignCode}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('assignCode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public adjustItem(details: SaveProductStock): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SaveProductStock, BaseAPIResponseModel<string>>(`${ApiUrl.adjustItem}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('adjustItem', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePriceList(details: updatePriceListDto): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<updatePriceListDto, BaseAPIResponseModel<string>>(`${ApiUrl.updatePriceList}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePriceList', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public generateBarcode(details: Array<number>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<Array<number>, BaseAPIResponseModel<string>>(`${ApiUrl.generateBarcode}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('generateBarcode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteProduct(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteProduct}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteProduct', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
    public updateManufacturing(data: Array<ManufactureAdjustItem>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<Array<AdjustItem>, BaseAPIResponseModel<string>>(`${ApiUrl.updateManufacturing}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateManufacturing', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateAdjustItem(data: Array<AdjustItem>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<Array<AdjustItem>, BaseAPIResponseModel<string>>(`${ApiUrl.updateAdjustItem}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateAdjustItem', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
