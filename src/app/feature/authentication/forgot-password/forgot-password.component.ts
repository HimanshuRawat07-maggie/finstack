import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forgotPassword } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  data: forgotPassword = {};
  isforgotPasswordFormVisible = true;

  @ViewChild('forgotPasswordForm') forgotPasswordForm?: any;
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) { }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  onSubmit() {
    if (this.isforgotPasswordFormVisible) {
      this.forgotPasswordForm.control.markAllAsTouched();
    }
    if (!this.forgotPasswordForm.form.valid)
      return;

    this.userService.forgotPassword(this.data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message)
      }
      else {
        this.toastr.error(res.message);
      }
    })
  }
}
