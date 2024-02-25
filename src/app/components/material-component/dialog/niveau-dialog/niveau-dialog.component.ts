import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CycleService } from '../../../../services/cycle.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { CycleDialogComponent } from '../cycle-dialog/cycle-dialog.component';
import { NiveauService } from '../../../../services/niveau.service';

@Component({
  selector: 'app-niveau-dialog',
  templateUrl: './niveau-dialog.component.html',
  styleUrl: './niveau-dialog.component.scss'
})
export class NiveauDialogComponent {
  onAddNiveau= new EventEmitter();
  onEditNiveau= new EventEmitter();
  niveauForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  cycles: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private cycleService:CycleService,
    private niveauService:NiveauService,
    public dialogRef: MatDialogRef<NiveauDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.niveauForm = this.fb.group({
      libelle: [null,[Validators.required]],
      cycleId: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        libelle: formData.libelle,
        cycleId: formData.cycle.id
      }
      this.niveauForm.patchValue(data);
    }
    this.getCycles();
  }


  getCycles() {
    this.cycleService.getAll().subscribe({
      next:(response:any) => {
        this.cycles = response
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
  var formData = this.niveauForm.value;
  var data = {
    libelle: formData.libelle,
    cycleId: formData.cycleId
  }
  this.niveauService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddNiveau.emit();
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
  var formData = this.niveauForm.value;
  var data = {
    id: this.dialogData.data.id,
    libelle: formData.libelle,
    cycleId: formData.cycleId
  }
  this.niveauService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditNiveau.emit();
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
