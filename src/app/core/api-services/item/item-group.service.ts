import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { GetProductById, GetProductResponse, ItemPrintDetails, Product, ProductGroup, ProductGroupName, ProductStockRequestDto, SaveProductOrService } from '../../api-models/item-model';
import { ApiUrl } from '../../constants/api-url-constant';
import { GetItemByGroupId, GetProductGroup } from '../../api-models/item-group';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService, private http: HttpClient) {
    super(broadcaster, appStateService);
  }

  public getAllGroup(): Observable<BaseAPIResponseModel<Array<ProductGroup>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<ProductGroup>>>(ApiUrl.getAllGroup).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public getManufacturedProductById(id: number): Observable<BaseAPIResponseModel<any>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<any>>(`${ApiUrl.getManufacturedProductById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getManufacturedProductById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getProductById(id: number): Observable<BaseAPIResponseModel<Product>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Product>>(`${ApiUrl.getProductById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getProductById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getProductByInitialId(id: number): Observable<BaseAPIResponseModel<GetProductById>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<GetProductResponse>>(`${ApiUrl.getProductByInitialId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getProductByInitialId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllProductGroup(): Observable<BaseAPIResponseModel<Array<GetProductGroup>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GetProductGroup>>>(ApiUrl.getAllProductGroup).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllProductGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateProduct(data: GetProductResponse): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<GetProductResponse, BaseAPIResponseModel<string>>(`${ApiUrl.updateProduct}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateProduct', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public unlinkProduct(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.unlinkProduct}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('unlinkProduct', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public linkProduct(id: number, name: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.linkProduct}${id}${'&groupName='}${name}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('linkProduct', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateProductStock(data: ProductStockRequestDto): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<ProductStockRequestDto, BaseAPIResponseModel<string>>(`${ApiUrl.updateProductStock}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateProductStock', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateProductGroup(data: ProductGroupName): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<ProductGroupName, BaseAPIResponseModel<string>>(`${ApiUrl.updateProductGroup}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateProductGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getProductStockById(id: number): Observable<BaseAPIResponseModel<ProductStockRequestDto>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<ProductStockRequestDto>>(`${ApiUrl.getProductStockById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getProductStockById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getByProductGroupId(id: number): Observable<BaseAPIResponseModel<Array<GetItemByGroupId>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GetItemByGroupId>>>(`${ApiUrl.getByProductGroupId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getByProductGroupId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveProductOrService(details: Product): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Product, BaseAPIResponseModel<string>>(`${ApiUrl.saveProductOrService}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveProductOrService', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  // public printBarCode(details: Array<ItemPrintDetails>,column:number): Observable<BaseAPIResponseModel<string>> {
  //   this.processing(true);
  //   return this.webApiService.PostApi<Array<ItemPrintDetails>, BaseAPIResponseModel<string>>(`${ApiUrl.printBarCode}${column}`, details).pipe(
  //     catchError(err => {
  //       return throwError(() => this.handleError('printBarCode', err));
  //     }))
  //     .pipe(
  //       tap((response) => {
  //         this.processing(false);
  //       }),
  //     );
  // }
  
    public printBarCode(details: Array<ItemPrintDetails>,column:number): Observable<Blob> {
    return this.http.post(environment.apiEndpoint + `${ApiUrl.printBarCode}` + column, details, {
      responseType: 'blob'
    });
  }

  public AddProductGroup(item: ProductGroupName): Observable<BaseAPIResponseModel<ProductGroupName>> {
    this.processing(true);
    return this.webApiService.PostApi<ProductGroupName, BaseAPIResponseModel<ProductGroupName>>(`${ApiUrl.AddProductGroup}`, item).pipe(
      catchError(err => {
        return throwError(() => this.handleError('AddProductGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteProductGroup(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteProductGroup}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteProductGroup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
