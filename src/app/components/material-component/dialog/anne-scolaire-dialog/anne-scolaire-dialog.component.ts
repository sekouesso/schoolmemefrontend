import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MatiereComponent } from '../../matiere/matiere.component';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { AnneScolaireComponent } from '../../anne-scolaire/anne-scolaire.component';

@Component({
  selector: 'app-anne-scolaire-dialog',
  templateUrl: './anne-scolaire-dialog.component.html',
  styleUrl: './anne-scolaire-dialog.component.scss'
})
export class AnneScolaireDialogComponent {
  onAddAnneScolaire = new EventEmitter();
  onEditAnneScolaire = new EventEmitter();
  anneScolaireForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private anneScolaireService:AnneScolaireService,
    public dialogRef: MatDialogRef<AnneScolaireDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.anneScolaireForm = this.fb.group({
      annee: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.anneScolaireForm.patchValue(this.dialogData.data);
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
  var formData = this.anneScolaireForm.value;
  var data = {
    annee: formData.annee
  }
  this.anneScolaireService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddAnneScolaire.emit();
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
  var formData = this.anneScolaireForm.value;
  var data = {
    id: this.dialogData.data.id,
    annee: formData.annee
  }
  this.anneScolaireService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditAnneScolaire.emit();
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
