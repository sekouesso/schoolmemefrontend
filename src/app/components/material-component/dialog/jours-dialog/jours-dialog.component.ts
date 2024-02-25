import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { CycleService } from '../../../../services/cycle.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TarifsService } from '../../../../services/tarifs.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { TarifsDialogComponent } from '../tarifs-dialog/tarifs-dialog.component';
import { JourService } from '../../../../services/jour.service';
import { JoursComponent } from '../../jours/jours.component';

@Component({
  selector: 'app-jours-dialog',
  templateUrl: './jours-dialog.component.html',
  styleUrl: './jours-dialog.component.scss'
})
export class JoursDialogComponent {

  num: any;
  code: any;
  onAddJours = new EventEmitter();
  onEditJours = new EventEmitter();
  joursForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public jourService:JourService,
    public dialogRef: MatDialogRef<JoursDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.joursForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.joursForm = this.fb.group({
      code: ['', [Validators.required]],      
      libelle: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.jourService.getNumero().subscribe(
    response => {
      this.num = response;
      this.code = (1000 + this.num + 1).toString().substring(1);
      this.joursForm.controls.code.setValue(this.code);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        code: formData.code,
        libelle: formData.libelle,
      }
      
      this.joursForm.patchValue(data);
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
  var formData = this.joursForm.value;
  var data = {
    code: formData.code,
    libelle: formData.libelle,
  }
  this.jourService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddJours.emit();
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
  var formData = this.joursForm.value;
  var data = {
    id: this.dialogData.data.id,
    code: formData.code,
    libelle: formData.libelle
  }
  this.jourService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditJours.emit();
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
