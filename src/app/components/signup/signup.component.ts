import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { GlobalConstants } from '../../shared/global-constants';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  password=true;
  confirmPassword=true;
  signupForm:any= FormGroup;
  responseMessage:any;

  displayColumns: string[] = ['nom', 'prenom', 'email', 'profession', 'telephone','role','active'];
  dataSource: any;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nom:[null,[Validators.required, Validators.pattern(GlobalConstants.nomRegex)]],
      profession:[null,[Validators.required, Validators.pattern(GlobalConstants.nomRegex)]],
      role:[null,[Validators.required, Validators.pattern(GlobalConstants.nomRegex)]],
      prenom:[null,[Validators.required, Validators.pattern(GlobalConstants.prenomRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      telephone:[null,[Validators.required, Validators.pattern(GlobalConstants.telephoneRegex)]],
      password:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    });
    this.tableData();
  }

  validateSubmit(){
    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  tableData() {
    this.userService.getUsers().subscribe({next:(response:any)=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    },
    error:(error:any)=>{
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }
  });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    console.log(formData);
    
    var data = {
      nom:formData.nom,
      prenom:formData.prenom,
      email:formData.email,
      role:formData.role,
      profession:formData.profession,
      active:true,
      telephone:formData.telephone,
      password:formData.password
    }
    console.log(data);
    this.userService.signup(data).subscribe({
      next:(response:any)=>{
        this.tableData();
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage,"");
      this.router.navigate(['/school/utilisateur']);
    },error:(error)=>{
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
