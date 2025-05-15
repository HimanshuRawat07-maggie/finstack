import { splitNsName } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Signup } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { AppEvents } from 'src/app/core/models/appenums';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  data: Signup = {
    name: '',
    email: '',
    password: '',
    companyName: ''
  }
  confirmPassword: string = '';
  isSignUpFormVisible = true;
  isNumber = false;
  check = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  @ViewChild('signUpForm') signUpForm?: any;
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService, private authservice: AuthenticationService,
    private appStateService: AppStateService,private route:ActivatedRoute) { }
  
  
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params) {
      this.data.licenseKey = params['license'];
} });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  onSubmit() {
    if (this.isSignUpFormVisible) {
      this.signUpForm.control.markAllAsTouched();
    }
    if (this.signUpForm.form.valid)
      return;

    const regex = /^[0-9]+$/
    if (this.data.phoneNumber) {
      this.isNumber = regex.test(this.data.phoneNumber);
    }

    if (this.confirmPassword.length > 7 && this.confirmPassword == this.data.password || this.isNumber) {
      this.data.phoneNumber = this.data.phoneNumber?.toString();
      if (this.check == false) {
        this.toastr.error('Check Our Privacy Policy');
        return;
      }
      const sub = this.userService.signUp(this.data).subscribe(res => {
        if (res.code == 200) {
          this.toastr.success('Signup Successfully');
          this.authservice.token = res.data.token;
          this.appStateService.sendEvent(AppEvents.SetUser, res.data);
          this.appStateService.sendEvent(AppEvents.LoggedIn, true);
          this.navigateTo('app/dashboard');
        }
        else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    }
  }


  isMaxErrorPasswordVisible() {
    let isValid = true;
    if (this.data.password) {
      if (this.data.password!.length < 8) {
        isValid = false;
      }
    }

    return isValid;
  }

}
