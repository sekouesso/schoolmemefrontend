import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { CycleService } from '../../../../services/cycle.service';
import { CycleComponent } from '../../cycle/cycle.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-cycle-dialog',
  templateUrl: './cycle-dialog.component.html',
  styleUrl: './cycle-dialog.component.scss'
})
export class CycleDialogComponent {

  onAddCycle= new EventEmitter();
  onEditCycle= new EventEmitter();
  cycleForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private cycleService:CycleService,
    public dialogRef: MatDialogRef<CycleDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.cycleForm = this.fb.group({
      libelle: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.cycleForm.patchValue(this.dialogData.data);
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
  var formData = this.cycleForm.value;
  var data = {
    libelle: formData.libelle
  }
  this.cycleService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddCycle.emit();
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
  var formData = this.cycleForm.value;
  var data = {
    id: this.dialogData.data.id,
    libelle: formData.libelle
  }
  this.cycleService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditCycle.emit();
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
