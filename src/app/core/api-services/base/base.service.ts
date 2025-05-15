import { Injectable } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster/broadcaster.service';
import { AppStateService } from '../../services/app-state/app.state.service';
import { AppEvents } from '../../models/appenums';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {

  private isProcessing = false;

  constructor(private broadcaster: BroadcasterService, private appStateService: AppStateService) {
  }

  public processing(isProcessing: boolean) {
    //if (this.showLoading) {
    // setTimeout(() => {
    this.isProcessing = isProcessing;
    this.appStateService.sendEvent(AppEvents.Processing, isProcessing);
    // }, 100);
    //}

  }

  public handleError(methodName: any, err: any) {
    this.processing(false);

    // if (err.status === 422) { // Validation error for the call, we handle this differently
    //   return this.handleValidationError(err);
    // } else

    if (err.status === 401) {  // expired token
      return this.handleUnAuthorizedError();
    }

    throw (err); // global error handler will catch this and show in toast
  }

  public handleUnAuthorizedError() {
    // Un-Authorized, session expired so send them back to login page.
    // app components will check for this 401 and show toast and redirect user to login page
    // err.error.Message = 'Your session has expired, you will be redirected to the login page.';
    // this.broadcaster.broadcast(AppEvents.ShowToast, {
    //   title: 'Token Expired',
    //   summary: err.error.Message, status: err.status, error: true
    // });
    this.broadcaster.RedirectToLogin();
  }
}
