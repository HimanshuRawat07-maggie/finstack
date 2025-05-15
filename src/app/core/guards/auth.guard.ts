import { Injectable } from '@angular/core';
import { Router, UrlTree, } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private router: Router, private authService: AuthenticationService) { }
    canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.authenticated) {
            return true;
        } else {
            this.router.navigateByUrl('login');
            this.authService.logoff();
            return false;
        }
    }
}
