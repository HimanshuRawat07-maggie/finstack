import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UpdatePassword } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { AppEvent } from 'src/app/core/models/appevents';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  data: UpdatePassword = {};
  confirmPassword: string = '';
  isLoginFormVisible = true;

  @ViewChild('loginForm') loginForm?: any;
  constructor(public dialogRef: MatDialogRef<ResetPasswordComponent>, private appStateService: AppStateService,
    private userService: UserService,private toastr:ToastrService) { }
  
  ngOnInit(){
    this.data.token = localStorage.getItem('token');
    const sub= this.appStateService.currentUser().subscribe(res => {
      this.data.userId = res.userId;
      sub.unsubscribe();
    })
  }
  
  close() {
    this.dialogRef.close();
  }

  onSubmit() {
     if (this.isLoginFormVisible) {
      this.loginForm.control.markAllAsTouched();
    }
    if (!this.loginForm.form.valid)
      return;
    
    const sub = this.userService.updatePassword(this.data).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success('Password Updated Successfully');
        this.close();
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  
  isMaxErrorPasswordVisible() {
    let isValid = true;
    if (this.data.newPassword) {
      if (this.data.newPassword!.length < 8) {
        isValid = false;
      }
    }

    return isValid;
  }

}
