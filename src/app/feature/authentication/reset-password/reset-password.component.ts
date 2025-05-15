import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { resetPassword } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  checkPassword: string = '';
  token: string = '';
  isResetPasswordFormVisible = true;
  data: resetPassword = {
    token: '',
    password: ''
  }

  @ViewChild('resetPasswordForm') resetPasswordForm?: any;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(parameterMap => {
      let token = parameterMap.get('token');
      if (token != null) {
        this.data.token = token;

      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  onSubmit() {
    if (this.isResetPasswordFormVisible) {
      this.resetPasswordForm.control.markAllAsTouched();
    }
    if (!this.resetPasswordForm.form.valid)
      return;
    this.userService.resetPassword(this.data).subscribe(res => {
      if (res.code == 200) {
        this.navigateTo('login');
        this.toastr.success(res.message);
      }
      else if (res.code == 400) {
        this.toastr.error(res.message);
      }
    });
  }

  isMaxErrorPasswordVisible() {
    let isValid = true;
    if (this.checkPassword) {
      if (this.checkPassword!.length < 8) {
        isValid = false;
      }
    }
    return isValid;
  }
}
