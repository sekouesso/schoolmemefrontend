import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatiereService } from '../../../../services/matiere.service';
import { MatiereComponent } from '../../matiere/matiere.component';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-matiere-dialog',
  templateUrl: './matiere-dialog.component.html',
  styleUrl: './matiere-dialog.component.scss'
})
export class MatiereDialogComponent {

  onAddMatiere = new EventEmitter();
  onEditMatiere = new EventEmitter();
  matiereForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private matiereService:MatiereService,
    public dialogRef: MatDialogRef<MatiereComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.matiereForm = this.fb.group({
      libelle: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.matiereForm.patchValue(this.dialogData.data);
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
  var formData = this.matiereForm.value;
  var data = {
    libelle: formData.libelle
  }
  this.matiereService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddMatiere.emit();
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
  var formData = this.matiereForm.value;
  var data = {
    id: this.dialogData.data.id,
    libelle: formData.libelle
  }
  this.matiereService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditMatiere.emit();
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
