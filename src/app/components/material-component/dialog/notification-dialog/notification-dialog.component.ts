import { Component, EventEmitter, Inject } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EleveService } from '../../../../services/eleve.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { UserService } from '../../../../services/user.service';
import { GlobalConstants } from '../../../../shared/global-constants';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  num: any;
  code: any;
  onAddNotification = new EventEmitter();
  onEditNotification = new EventEmitter();
  eleveForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  cycles: any;
  anneScolaires: any;
  numero: any;
  eleves: any;
  parents: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public eleveService:EleveService,
    private userService:UserService,
    private notificationService:NotificationService,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.eleveForm.controls }

 

  ngOnInit(): void {
    let p: any = localStorage.getItem('user')
    let parent:any = JSON.parse(p);
    console.log(p, parent);
    
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.eleveForm = this.fb.group({
      description: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      annee: [this.annee, [Validators.required]],      
      libelle: ['', [Validators.required]],
      eleveId: ['', [Validators.required]],
      parentId: [parent.id, [Validators.required]]
    });
if(!this.dialogData.data){
  this.eleveService.getNumero(this.annee).subscribe(
    response => {
      this.numero = response;
      if (this.numero == 0)
      {
        this.numero = (this.annee * 10000) +  1;
      }
      else
      {
        this.numero =  this.numero + 1;
      }
          
      this.eleveForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        description: formData.description,
        annee: formData.annee,
        libelle: formData.libelle,
        numero: formData.numero,
        eleveId: formData.eleve.id,
        parentId: formData.parent.id
      } 
      this.eleveForm.patchValue(data);
    }

    this.getParents();
    this.getEleves();
    
  }
  getParents() {
    this.userService.getUsers().subscribe({
      next:(response:any) => {
        this.parents = response
      },
      error:(error:any) => {
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
        
      }
    })
  }
  getEleves() {
    this.eleveService.getAll().subscribe({
      next:(response:any) => {
        this.eleves = response
      },
      error:(error:any) => {
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
        
      }
    })
  }

handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.eleveForm.value;
  var data = {
    numero: formData.numero,
    description: formData.description,
    annee: formData.annee,
    libelle: formData.libelle,
    eleveId: formData.eleveId,
    parentId: formData.parentId
  }
  
  this.eleveService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddNotification.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage,'success');
    },
    error: (error:any) => {
      this.dialogRef.close();
      console.error(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      
    }
  })
}
edit(){
  var formData = this.eleveForm.value;
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    description: formData.description,
    annee: formData.annee,
    libelle: formData.libelle,
    eleveId: formData.eleveId,
    parentId: formData.parentId
  }
  this.eleveService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditNotification.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage,'success');
    },
    error: (error:any) => {
      this.dialogRef.close();
      console.error(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      
    }
  })
}

  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
