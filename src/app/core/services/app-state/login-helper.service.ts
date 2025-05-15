import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class LoginHelperService {
    constructor(private router: Router, private authService: AuthenticationService) { }
    public RedirectToLogin() {
        this.authService.logoff();
        this.router.navigateByUrl('/login');
    }
}
