import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree, } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserPermissions } from '../api-models/permission-model';
import { AppStateService } from '../services/app-state/app.state.service';
import { BusinessHelpers } from '../helpers/business';
import { Constants } from '../constants/app-constant';

@Injectable({
    providedIn: 'root',
})
export class PageAccessGuard {
    userPermissions: UserPermissions;

    constructor(private router: Router, private authService: AuthenticationService, private appStateService: AppStateService) {
        this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    }

    canActivate(route: ActivatedRouteSnapshot): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // if (BusinessHelpers.hasPermission(this.userPermissions, route.data['module'], route.data['value'])) {
        //     return true;
        // } else {
        //     this.router.navigateByUrl('app/dashboard');
        //     return false;
        // }
        return true
    }
}
