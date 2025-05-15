import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { AppBaseService } from '../base/base.service';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { ApiUrl } from '../../constants/api-url-constant';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AddUser, BusinessCategory, CompanyDetails, CompanyLimits, CompanyType, GetAllCompany, GetInvoiceTemplate, GstIn, GstPortal, InvoiceTemplates, SplitCompany, State, getCompanyDetails, getUser } from '../../api-models/company-model';
import { CompanySettings } from '../../api-models/company-setting.model';
import { PaymentResposne, SignnUpResponse } from '../../api-models/auth-model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends AppBaseService {

  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public getAllStates(): Observable<BaseAPIResponseModel<Array<State>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<State>>>(ApiUrl.getAllStates).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllStates', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllCompanyType(): Observable<BaseAPIResponseModel<Array<CompanyType>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<CompanyType>>>(ApiUrl.getAllCompanyType).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllCompanyType', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
 
  public getGstPortalDetails(): Observable<BaseAPIResponseModel<GstPortal>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<GstPortal>>(ApiUrl.getGstPortalDetails).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGstPortalDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getGstPortalDetailsEWayBill(): Observable<BaseAPIResponseModel<GstPortal>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<GstPortal>>(ApiUrl.getGstPortalDetailsEWayBill).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGstPortalDetailsEWayBill', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  
   public gstPortalDetails(data: GstPortal): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<GstPortal, BaseAPIResponseModel<string>>(ApiUrl.gstPortalDetails, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('gstPortalDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

   public gstPortalDetailsEwayBill(data: GstPortal): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<GstPortal, BaseAPIResponseModel<string>>(ApiUrl.gstPortalDetailsEwayBill, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('gstPortalDetailsEwayBill', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getGstIn(gstIn: string): Observable<BaseAPIResponseModel<GstIn>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<GstIn>>(`${ApiUrl.getGstIn}${gstIn}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getGstIn', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getBusinessCategory(): Observable<BaseAPIResponseModel<Array<BusinessCategory>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<BusinessCategory>>>(ApiUrl.getBusinessCategory).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getBusinessCategory', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  
  public getInvoiceTemplates(): Observable<BaseAPIResponseModel<Array<InvoiceTemplates>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<InvoiceTemplates>>>(ApiUrl.getInvoiceTemplates).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getInvoiceTemplates', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteCompany(password: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteCompany}${password}`, null).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteCompany', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompanies(): Observable<BaseAPIResponseModel<Array<GetAllCompany>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<GetAllCompany>>>(ApiUrl.getComppany).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getComppany', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveCompanyInvoiceTheme(data: GetInvoiceTemplate): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<GetInvoiceTemplate, BaseAPIResponseModel<string>>(ApiUrl.saveCompanyInvoiceTheme, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveCompanyInvoiceTheme', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompanyInvoiceTheme(): Observable<BaseAPIResponseModel<GetInvoiceTemplate>> {
    this.processing(true);
    return this.webApiService.GetApi< BaseAPIResponseModel<GetInvoiceTemplate>>(ApiUrl.getCompanyInvoiceTheme).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompanyInvoiceTheme', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompanySettings(): Observable<BaseAPIResponseModel<CompanySettings>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<CompanySettings>>(ApiUrl.getCompanySettings).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompanySettings', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getLimits(): Observable<BaseAPIResponseModel<CompanyLimits>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<CompanyLimits>>(ApiUrl.getLimits).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getLimits', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveCompanySettings(data: CompanySettings): Observable<BaseAPIResponseModel<CompanySettings>> {
    this.processing(true);
    return this.webApiService.PostApi<CompanySettings, BaseAPIResponseModel<CompanySettings>>(ApiUrl.saveCompanySettings, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveCompanySettings', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public importMasterData(data: File): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<File, BaseAPIResponseModel<string>>(ApiUrl.importMasterData, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveCompanySettings', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  public importVoucherData(voucher: File): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<File, BaseAPIResponseModel<string>>(ApiUrl.importVoucherData, voucher).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveCompanySettings', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public addCompany(data: CompanyDetails): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<CompanyDetails, BaseAPIResponseModel<string>>(ApiUrl.addCompany, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('addCompany', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public splitCompany(data: SplitCompany): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<SplitCompany, BaseAPIResponseModel<string>>(ApiUrl.splitCompany, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('splitCompany', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public companySwitch(id: number): Observable<BaseAPIResponseModel<SignnUpResponse>> {
    this.processing(true);
    return this.webApiService.PostApi<number, BaseAPIResponseModel<SignnUpResponse>>(`${ApiUrl.companySwitch}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('addCompany', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllBusinessType(): Observable<BaseAPIResponseModel<Array<BusinessCategory>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<BusinessCategory>>>(ApiUrl.getAllBusinessType).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllBusinessType', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getAllGstType(): Observable<BaseAPIResponseModel<Array<BusinessCategory>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<BusinessCategory>>>(ApiUrl.getAllGstType).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getAllGstType', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompanyDetailsById(): Observable<BaseAPIResponseModel<getCompanyDetails>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<getCompanyDetails>>(ApiUrl.getCompanyDetailsById).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompanyDetailsById', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getUsers(): Observable<BaseAPIResponseModel<Array<getUser>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<getUser>>>(ApiUrl.getUsers).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getUsers', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public removeCompanyLogo(): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.removeCompanyLogo}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('removeCompanyLogo', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public removeSignature(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.removeSignature}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('removeCompanyLogo', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updateCompanyDetails(details: CompanyDetails): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<CompanyDetails, BaseAPIResponseModel<string>>(`${ApiUrl.updateCompanyDetails}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updateCompanyDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public addUser(details: AddUser): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<AddUser, BaseAPIResponseModel<string>>(`${ApiUrl.addUser}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('addUser', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public addCa(details: AddUser): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PutApi<AddUser, BaseAPIResponseModel<string>>(`${ApiUrl.addCa}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('addCa', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public deleteUser(id: number): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.DeleteApi<number, BaseAPIResponseModel<string>>(`${ApiUrl.deleteUser}${id}`, id).pipe(
      catchError(err => {
        return throwError(() => this.handleError('deleteUser', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
   public getSubscriptionByCode(code: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(`${ApiUrl.getSubscriptionByCode}${code}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getSubscriptionByCode', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCompanySettingByKey(key: string): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<string>>(`${ApiUrl.getCompanySettingByKey}${key}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getCompanySettingByKey', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public initiatePaymentForCompanies(): Observable<BaseAPIResponseModel<PaymentResposne>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<PaymentResposne>>(`${ApiUrl.initiatePaymentForCompanies}`, {}).pipe(
      catchError(err => {
        return throwError(() => this.handleError('initiatePaymentForCompanies', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public initiatePaymentForCompanyUsers(): Observable<BaseAPIResponseModel<PaymentResposne>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<PaymentResposne>>(`${ApiUrl.initiatePaymentForCompanyUsers}`, {}).pipe(
      catchError(err => {
        return throwError(() => this.handleError('initiatePaymentForCompanyUsers', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

}
