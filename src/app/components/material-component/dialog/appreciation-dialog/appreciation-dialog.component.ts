import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatiereService } from '../../../../services/matiere.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { MatiereComponent } from '../../matiere/matiere.component';
import { AppreciationService } from '../../../../services/appreciation.service';
import { AppreciationComponent } from '../../appreciation/appreciation.component';

@Component({
  selector: 'app-appreciation-dialog',
  templateUrl: './appreciation-dialog.component.html',
  styleUrl: './appreciation-dialog.component.scss'
})
export class AppreciationDialogComponent {

  onAddAppreciation = new EventEmitter();
  onEditAppreciation = new EventEmitter();
  appreciationForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private appreciationService:AppreciationService,
    public dialogRef: MatDialogRef<AppreciationDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.appreciationForm = this.fb.group({
      libelle: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.appreciationForm.patchValue(this.dialogData.data);
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
  var formData = this.appreciationForm.value;
  var data = {
    libelle: formData.libelle
  }
  this.appreciationService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddAppreciation.emit();
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
  var formData = this.appreciationForm.value;
  var data = {
    id: this.dialogData.data.id,
    libelle: formData.libelle
  }
  this.appreciationService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditAppreciation.emit();
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

}
