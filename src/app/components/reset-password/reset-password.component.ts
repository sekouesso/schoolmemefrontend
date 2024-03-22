import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  email = "";
  newPassword = true;
  confirmPassword = true;
  resetPasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<ResetPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      code:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    });
  }

  validateSubmit(){
    if(this.resetPasswordForm.controls['newPassword'].value != this.resetPasswordForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handlepasswordResetSubmit(){
    this.ngxService.start();
    var formData = this.resetPasswordForm.value;
    var data = {
      email:formData.email,
      code:formData.code,
      newPassword:formData.newPassword
    }
    console.log(data);
    
    this.userService.resetPassword(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage,'success');

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '550px';
      dialogConfig.data = {
        data: data.email
      };
      this.dialog.open(LoginComponent,dialogConfig);

    },error:(error:any)=>{
      console.log(error);
      
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

}
