import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm:any = FormGroup;
  responseMessage:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
    });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email:formData.email
    }
    this.userService.forgotPassword(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage,"");
      //this.router.navigate(['/']);

      const dialogConfig = new MatDialogConfig();
      // dialogConfig.data = {
      //   action:'Les règlements de '+values.nom+' '+values.prenom,
      //   data: values
      // };
      dialogConfig.width = '700px';
      // dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(ResetPasswordComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });



    },error:(error)=>{
      this.ngxService.stop();
      if(error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }

  })
  }

}
