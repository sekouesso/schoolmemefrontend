import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../../components/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SignupComponent } from '../../components/signup/signup.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from '../../components/material-component/change-password/change-password.component';
import { ConfirmationComponent } from '../../components/material-component/confirmation/confirmation.component';
import { ConfirmationDialogComponent } from '../../components/material-component/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  constructor(
    private dialog:MatDialog,
    private authService:AuthService,
    private router:Router
  ) { }

  handleLoginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent,dialogConfig);
  }

  role:any;
 

  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message: 'Logout ',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent,dialogConfig);
  }

  handleSignupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '650px';
    dialogConfig.height = '80vh';
    this.dialog.open(SignupComponent,dialogConfig);
  }

  handleForgotPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent,dialogConfig);
  }

}
