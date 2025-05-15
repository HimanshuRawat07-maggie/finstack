import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  static tokenStorageKey = 'token';
  static isWarehouseEnabledStorageKey = 'isWarehouseEnabled';
  static isBatchEnabledStorageKey = 'isBatchEnabled';
  static isEWayBillEnabledStorageKey = 'isEWayBillEnabled';
  static isEInvoiceEnabledStorageKey = 'isEInvoiceEnabled';
  static isManufacturnigEnabledStorageKey = 'isManufacturnigEnabled';
  static isDiscountEnabledStorageKey = 'isDiscountEnabled';

  constructor() { }

  public get authenticated() {
    const token = this.token;

    if (token == null || token == '')
      return false;

    return true;
  }

  public set token(value: string) {
    localStorage.setItem(AuthenticationService.tokenStorageKey, value);
  }

  public get token(): string {
    let value = localStorage.getItem(AuthenticationService.tokenStorageKey);
    if (value == null)
      return '';

    return value;
  }

  public set isWarehouseEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isWarehouseEnabledStorageKey, value ?? '');
  }

  public set isBatchEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isBatchEnabledStorageKey, value ?? '');
  }

  public set isEWayBillEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isEWayBillEnabledStorageKey, value ?? '');
  }

  public set isDiscountEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isDiscountEnabledStorageKey, value ?? '');
  }

  public set isEInvoiceEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isEInvoiceEnabledStorageKey, value ?? '');
  }

  public set isManufacturnigEnabled(value: string | null) {
    localStorage.setItem(AuthenticationService.isManufacturnigEnabledStorageKey, value ?? '');
  }

  public get isWarehouseEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isWarehouseEnabledStorageKey);
  }
  public get isDiscountEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isDiscountEnabledStorageKey);
  }

  public get isBatchEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isBatchEnabledStorageKey);
  }

  public get isEWayBillEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isEWayBillEnabledStorageKey);
  }

  public get isEInvoiceEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isEInvoiceEnabledStorageKey);
  }

  public get isManufacturnigEnabled(): string | null {
    return localStorage.getItem(AuthenticationService.isManufacturnigEnabledStorageKey);
  }

  public logoff = () => {
    localStorage.clear();
  }
}
