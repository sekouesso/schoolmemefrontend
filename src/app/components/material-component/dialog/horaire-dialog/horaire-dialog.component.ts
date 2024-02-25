import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { HoraireService } from '../../../../services/horaire.service';

@Component({
  selector: 'app-horaire-dialog',
  templateUrl: './horaire-dialog.component.html',
  styleUrl: './horaire-dialog.component.scss'
})
export class HoraireDialogComponent {
  num: any;
  code: any;
  onAddHoraire = new EventEmitter();
  onEditHoraire = new EventEmitter();
  horaireForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public horaireService:HoraireService,
    public dialogRef: MatDialogRef<HoraireDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.horaireForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.horaireForm = this.fb.group({
      code: ['', [Validators.required]],      
      heure: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.horaireService.getNumero().subscribe(
    response => {
      this.num = response;
      this.code = (1000 + this.num + 1).toString().substring(1);
      this.horaireForm.controls.code.setValue(this.code);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        code: formData.code,
        heure: formData.heure,
      }
      
      this.horaireForm.patchValue(data);
    }
    
  }
 
 

handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.horaireForm.value;
  var data = {
    code: formData.code,
    heure: formData.heure,
  }
  this.horaireService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddHoraire.emit();
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
  var formData = this.horaireForm.value;
  var data = {
    id: this.dialogData.data.id,
    code: formData.code,
    heure: formData.heure
  }
  this.horaireService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditHoraire.emit();
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
