import { Injectable } from '@angular/core';
import { Router, UrlTree, } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class LoggedInGuard {
    constructor(private router: Router, private authService: AuthenticationService) { }
    canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.authenticated) {
            this.router.navigateByUrl('app/dashboard');
            return false;
        } else {
            this.authService.logoff();
            return true;
        }
    }
}
