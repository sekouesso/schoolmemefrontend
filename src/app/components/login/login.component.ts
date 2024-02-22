import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide=true;
  loginForm:any = FormGroup;
  responseMessage:any='test response';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private dialogRef:MatDialogRef<LoginComponent>,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]],
    });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email:formData.email,
      password:formData.password
    }
    this.authService.login(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token',response["access-token"]);
      this.snackbarService.openSnackbar("success","")
      this.router.navigate(['/school/dashboard']);
    },error:(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }

  })
  }

  handleForgotPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent,dialogConfig);
  }
}