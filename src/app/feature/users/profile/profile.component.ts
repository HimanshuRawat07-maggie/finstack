import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDetail } from 'src/app/core/api-models/auth-model';
import { UserService } from 'src/app/core/api-services/user/user.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  data: UserDetail={};
  companyRole: string = '';
  constructor(private userService: UserService,private dialog:MatDialog) { }
  
  ngOnInit(){
   const sub = this.userService.getUserDetail().subscribe(res => {
     this.data = res.data;     
     if (this.data.companyRole == 'USER') {
       this.companyRole='User'
     } else if (this.data.companyRole == 'COMPANY_ADMIN') {
       this.companyRole = 'Admin';
     } else if (this.data.companyRole == 'CA') {
       this.companyRole='CA'
     }
     sub.unsubscribe();
    });
  }

  openResetPassword() {
    this.dialog.open(ResetPasswordComponent, {
      width: '30%',
      data: {},
    });
  }
}
