import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { WebApiService } from '../../services/web-api.service';
import { Login, PaymentResposne, SignnUpResponse, Signup, UpdatePassword, UserDetail, forgotPassword, resetPassword } from '../../api-models/auth-model';
import { BaseAPIResponseModel } from '../../api-models/base-api-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ApiUrl } from '../../constants/api-url-constant';
import { AppBaseService } from '../base/base.service';
import { UserGroupPermissions, UserPermissions } from '../../api-models/permission-model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AppBaseService {


  constructor(broadcaster: BroadcasterService, appStateService: AppStateService, private webApiService: WebApiService) {
    super(broadcaster, appStateService);
  }

  public signUp(auth: Signup): Observable<BaseAPIResponseModel<SignnUpResponse>> {
    this.processing(true);
    return this.webApiService.PostApi<Signup, BaseAPIResponseModel<SignnUpResponse>>(`${ApiUrl.signUp}`, auth).pipe(
      catchError(err => {
        return throwError(() => this.handleError('signup', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public updatePassword(details:UpdatePassword): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<UpdatePassword, BaseAPIResponseModel<string>>(`${ApiUrl.updatePassword}`, details).pipe(
      catchError(err => {
        return throwError(() => this.handleError('updatePassword', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  
  // public updatePassword(details:UpdatePassword): Observable<BaseAPIResponseModel<string>> {
  //   this.processing(true);
  //   return this.webApiService.PostApi<UpdatePassword, BaseAPIResponseModel<string>>(ApiUrl.updatePassword, details).pipe(
  //     catchError(err => {
  //       return throwError(() => this.handleError('updatePassword', err));
  //     }))
  //     .pipe(
  //       tap((response) => {
  //         this.processing(false);
  //       }),
  //     );
  // }

  public login(auth: Login): Observable<BaseAPIResponseModel<SignnUpResponse>> {
    this.processing(true);
    return this.webApiService.PostApi<Login, BaseAPIResponseModel<SignnUpResponse>>(`${ApiUrl.login}`, auth).pipe(
      catchError(err => {
        return throwError(() => this.handleError('login', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public postUserPermissions(data: Array<UserPermissions>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Array<UserPermissions>, BaseAPIResponseModel<string>>(`${ApiUrl.postUserPermissions}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('postUserPermissions', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public postUserGroupPermissions(data: Array<UserGroupPermissions>): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<Array<UserGroupPermissions>, BaseAPIResponseModel<string>>(`${ApiUrl.postUserGroupPermissions}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('postUserGroupPermissions', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public forgotPassword(data: forgotPassword): Observable<BaseAPIResponseModel<SignnUpResponse>> {
    this.processing(true);
    return this.webApiService.PostApi<forgotPassword, BaseAPIResponseModel<SignnUpResponse>>(`${ApiUrl.forgotPassword}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('forgotPassword', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public resetPassword(data: resetPassword): Observable<BaseAPIResponseModel<SignnUpResponse>> {
    this.processing(true);
    return this.webApiService.PostApi<resetPassword, BaseAPIResponseModel<SignnUpResponse>>(`${ApiUrl.resetPassword}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('resetPassword', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getUserDetail(): Observable<BaseAPIResponseModel<UserDetail>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<UserDetail>>(`${ApiUrl.getUserDetail}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getUserDetail', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getUserPermission(id: number): Observable<BaseAPIResponseModel<UserPermissions>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<UserPermissions>>(`${ApiUrl.getUserPermission}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getUserPermission', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
  public getUserGroupPermission(id: number): Observable<BaseAPIResponseModel<UserGroupPermissions>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<UserGroupPermissions>>(`${ApiUrl.getUserGroupPermission}${id}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getUserGroupPermission', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public getCurrentUserPermission(): Observable<BaseAPIResponseModel<Array<UserPermissions>>> {
    this.processing(true);
    return this.webApiService.GetApi<BaseAPIResponseModel<Array<UserPermissions>>>(`${ApiUrl.getCurrentUserPermission}`).pipe(
      catchError(err => {
        return throwError(() => this.handleError('getUserPermission', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public initiatePayment(): Observable<BaseAPIResponseModel<PaymentResposne>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<PaymentResposne>>(`${ApiUrl.subscribe}`, {}).pipe(
      catchError(err => {
        return throwError(() => this.handleError('subscribe', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public initiateEInvoicingPayment(): Observable<BaseAPIResponseModel<PaymentResposne>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<PaymentResposne>>(`${ApiUrl.initiateEInvoicingPayment}`, {}).pipe(
      catchError(err => {
        return throwError(() => this.handleError('initiateEInvoicingPayment', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public initiateEWayBillPayment(): Observable<BaseAPIResponseModel<PaymentResposne>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<PaymentResposne>>(`${ApiUrl.initiateEWayBillPayment}`, {}).pipe(
      catchError(err => {
        return throwError(() => this.handleError('initiateEWayBillPayment', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }

  public saveTransactionDetails(data: any): Observable<BaseAPIResponseModel<string>> {
    this.processing(true);
    return this.webApiService.PostApi<any, BaseAPIResponseModel<string>>(`${ApiUrl.saveTransactionDetails}`, data).pipe(
      catchError(err => {
        return throwError(() => this.handleError('saveTransactionDetails', err));
      }))
      .pipe(
        tap((response) => {
          this.processing(false);
        }),
      );
  }
}
