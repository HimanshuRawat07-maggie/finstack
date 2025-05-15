import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { ApiUrl } from '../../constants/api-url-constant';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreditNoteGetAll, EWayBill, PayemntIn, SaleInvoiceGetAll, SaleOrderGetAll } from '../../api-models/sale-model';
import { SalePurchase, SalePurchaseApiModel } from '../../models/sale-purchase-template';
import { DebitNote } from '../../api-models/purchase';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { cancelEInvoice } from '../../api-models/report-model';


@Injectable({
  providedIn: 'root'
})
export class SaleService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService,
    private http: HttpClient) {
    super(broadcaster, appStateService);
  }

  public getLatestOrderNumber(type: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(ApiUrl.getLatestOrderNumber + type).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getLatestOrderNumber', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePaymentIn(details: SalePurchase): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchase, BaseAPIResponseModel<string>>(`${ApiUrl.savePaymentIn}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePaymentIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public cancelEInvoice(data:cancelEInvoice): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<cancelEInvoice, BaseAPIResponseModel<string>>(`${ApiUrl.cancelEInvoice}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('cancelEInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePaymentOut(details: SalePurchase): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchase, BaseAPIResponseModel<string>>(`${ApiUrl.savePaymentOut}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePaymentOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public generateEInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.checkEinvoice}${id}`, null).pipe(
      catchError(err => {
        return throwError(() => this.handleError('checkEinvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public generateEWayBill(data: EWayBill): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<EWayBill, BaseAPIResponseModel<string>>(`${ApiUrl.generateEWayBill}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('generateEWayBill', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePaymentIn(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePaymentIn}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePaymentIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  public deletePaymentOut(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePaymentOut}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePaymentOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePaymentIn(order: SalePurchase): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchase, BaseAPIResponseModel<string>>(ApiUrl.updatePaymentIn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePaymentIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePaymentOut(order: SalePurchase): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchase, BaseAPIResponseModel<string>>(ApiUrl.updatePaymentOut, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePaymentOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPaymentIn(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PayemntIn>>> {
    this.processing(true);
    let url = ApiUrl.getAllPaymentIn
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PayemntIn>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPaymentIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPaymentOut(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<PayemntIn>>> {
    this.processing(true);
    let url = ApiUrl.getAllPaymentOut
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<PayemntIn>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPaymentOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPaymentInById(id: number): Observable<BaseAPIResponseModel<SalePurchase>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchase>>(`${ApiUrl.getPaymentInById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPaymentInById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPaymentOutById(id: number): Observable<BaseAPIResponseModel<SalePurchase>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchase>>(`${ApiUrl.getPaymentOutById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPaymentOutById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPaymentInByPartyId(id: number): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(`${ApiUrl.getAllPaymentInByPartyId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPaymentInByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public unPaidPaymentInByPartyId(id: number, paymentInId: number): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = `${ApiUrl.unPaidPaymentInByPartyId}${id}`;
    if (paymentInId > 0) {
      url += `&paymentInId=${paymentInId}`;
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('unPaidPaymentInByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public unPaidPaymentOutByPartyId(id: number, paymentInId: number): Observable<BaseAPIResponseModel<Array<DebitNote>>> {
    this.processing(true);
    let url = `${ApiUrl.unPaidPaymentOutByPartyId}${id}`;
    if (paymentInId > 0) {
      url += `&paymentInId=${paymentInId}`;
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<DebitNote>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('unPaidPaymentOutByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public getAllSaleInvoices(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllSaleInvoices
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSaleInvoices', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllSaleAsstes(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllSaleAsstes
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSaleAsstes', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllPosInvoice(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllPosInvoice
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllPosInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllTaxInvoice(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllTaxInvoice
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
      console.log(url);
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllTaxInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllServiceInvoice(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllServiceInvoice
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
      console.log(url);
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllServiceInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllExportInvoice(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllExportInvoice
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
      console.log(url);
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleInvoiceGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllExportInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSaleInvoiceById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getSaleInvoiceById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleInvoiceById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSaleAssetById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getSaleAssetById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleAssetById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSaleOrderById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getSaleOrderById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleOrderById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getChallanOutById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getChallanOutById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getChallanOutById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPendingSaleOrderByPartyId(id: number,isChallan:boolean): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(`${ApiUrl.getPendingSaleOrderByPartyId}${id}&includeChallans=${isChallan}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getPendingSaleOrderByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompletedSaleByPartyId(id: number): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(`${ApiUrl.getCompletedSaleByPartyId}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompletedSaleByPartyId', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getSaleReturnById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getSaleReturnById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleReturnById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getExportInvoiceById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getExportInvoiceById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getExportInvoiceById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getPosInvoiceById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getPosInvoiceById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSaleReturnById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getTaxInvoiceById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getTaxInvoiceById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getTaxInvoiceById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getServiceInvoiceById(id: number): Observable<BaseAPIResponseModel<SalePurchaseApiModel>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<SalePurchaseApiModel>>(`${ApiUrl.getServiceInvoiceById}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getServiceInvoiceById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllSaleOrder(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllSaleOrder
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllSaleOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllChallanOut(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<SaleOrderGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllChallanOut
    if (startDate && endDate) {
      url = url + `${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<SaleOrderGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllChallanOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllCreditNote(startDate?: string, endDate?: string): Observable<BaseAPIResponseModel<Array<CreditNoteGetAll>>> {
    this.processing(true);
    let url = ApiUrl.getAllCreditNote
    if (startDate && endDate) {
      url = url + `?startDate=${startDate}&endDate=${endDate}`
    }
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<CreditNoteGetAll>>>(url).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllCreditNote', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveSalesInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveSalesInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  
  public saveSalesAsset(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveSalesAsset, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveSalesAsset', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public savePosInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.savePosInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('savePosInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveTaxInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveTaxInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveTaxInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveServiceInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveServiceInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveServiceInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveExportInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveExportInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveExportInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateSalesInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateSalesInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateSalesAsset(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateSalesAsset, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateSalesAsset', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePosInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updatePosInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePosInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateTaxInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateTaxInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateTaxInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateServiceInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateServiceInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateServiceInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateExportInvoice(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateExportInvoice, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateExportInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateSalesReturn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateSalesReturn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateSalesReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateSalesOrder(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateSalesOrder, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateSalesOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateChallanOut(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.updateChallanOut, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateChallanOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveSalesOrder(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveSalesOrder, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveSalesOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveChallanOut(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveChallanOut, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveChallanOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveSalesReturn(order: SalePurchaseApiModel): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SalePurchaseApiModel, BaseAPIResponseModel<string>>(ApiUrl.saveSalesReturn, order).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveSalesReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteSaleInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteSaleInvoice}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteSaleInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteExportInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteExportInvoice}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteExportInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteSaleAssets(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteSaleAssets}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteSaleAssets', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deletePosInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deletePosInvoice}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deletePosInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteTaxInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteTaxInvoice}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteTaxInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteServiceInvoice(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteServiceInvoice}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteServiceInvoice', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteSaleOrder(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteSaleOrder}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteSaleOrder', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteChallanOut(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteChallanOut}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteChallanOut', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteSaleReturn(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteSaleReturn}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteSaleReturn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }


  public openPdf(id: number, templateId?: number, color?: string): Observable<Blob> {
    let url = `invoice/generate-pdf?id=${id}`;
    if (templateId) {
      url = url + `&templateId=${templateId}`;
    }
    if (color) {    
      url = url + `&colorCode=${color}`
    }
    return this.http.post(environment.apiEndpoint + url, null, {
      responseType: 'blob'
    });
  }

  public openPosPdf(id: number): Observable<Blob> {
    return this.http.post(environment.apiEndpoint + 'invoice/generate-pos?id=' + id, null, {
      responseType: 'blob'
    });
  }
}
