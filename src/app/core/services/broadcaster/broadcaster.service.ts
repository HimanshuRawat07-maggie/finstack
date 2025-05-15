import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginHelperService } from '../app-state/login-helper.service';

export interface BroadcastEvent {
    key: any;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})

export class BroadcasterService {
    private _transmission: Subject<BroadcastEvent>;

    constructor(private loginHelperService: LoginHelperService) {
        this._transmission = new Subject<BroadcastEvent>();
    }

    public broadcast(key: any, data?: any): void {
        this._transmission.next({ key, data });
    }

    public receive<T>(key: any): Observable<T> {
        return this._transmission.asObservable()
            .pipe(filter(event => event.key === key))
            .pipe(map(event => <T>event.data));
    }
    public RedirectToLogin() {
        this.loginHelperService.RedirectToLogin();
    }
}