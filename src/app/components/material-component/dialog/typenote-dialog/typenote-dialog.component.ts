import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TypeNoteService } from '../../../../services/type-note.service';
import { TypenoteComponent } from '../../typenote/typenote.component';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-typenote-dialog',
  templateUrl: './typenote-dialog.component.html',
  styleUrl: './typenote-dialog.component.scss'
})
export class TypenoteDialogComponent {

  onAddTypenote= new EventEmitter();
  onEditTypenote= new EventEmitter();
  typenoteForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private typenoteService:TypeNoteService,
    public dialogRef: MatDialogRef<TypenoteDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.typenoteForm = this.fb.group({
      libelle: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.typenoteForm.patchValue(this.dialogData.data);
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
  var formData = this.typenoteForm.value;
  var data = {
    libelle: formData.libelle
  }
  this.typenoteService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddTypenote.emit();
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
  var formData = this.typenoteForm.value;
  var data = {
    id: this.dialogData.data.id,
    libelle: formData.libelle
  }
  this.typenoteService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditTypenote.emit();
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
