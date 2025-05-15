import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { AppEvents } from 'src/app/core/models/appenums';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  data: Login = {
    email: '',
    password: ''
  }
  isLoginFormVisible = true;
  isPasswordMasked= true;

  @ViewChild('loginForm') loginForm?: any;
  constructor(private router: Router, private userService: UserService, private authservice: AuthenticationService, private toastr: ToastrService, private appStateService: AppStateService) { }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  onSubmit() {
    if (this.isLoginFormVisible) {
      this.loginForm.control.markAllAsTouched();
    }
    if (!this.loginForm.form.valid)
      return;

    const sub = this.userService.login(this.data).subscribe(res => {
      if (res.code == 200) {
        this.authservice.token = res.data.token;
        this.appStateService.sendEvent(AppEvents.SetUser, res.data);
        this.appStateService.sendEvent(AppEvents.LoggedIn, true);
        this.navigateTo('app/dashboard');
      }
      else {
        this.toastr.error(res.message);
      }
      sub.unsubscribe();
    })
  }

  togglePasswordVisibility() {
    this.isPasswordMasked=!this.isPasswordMasked
  }
}
