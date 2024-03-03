import { Component, EventEmitter, Inject } from '@angular/core';
import { LabsenceService } from '../../../../services/labsence.service';
import { EleveService } from '../../../../services/eleve.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';

@Component({
  selector: 'app-labsence-dialog',
  templateUrl: './labsence-dialog.component.html',
  styleUrl: './labsence-dialog.component.scss'
})
export class LabsenceDialogComponent {

  onAddLabsence= new EventEmitter();
  onEditLabsence= new EventEmitter();
  labsenceForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  eleves: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private labsenceService:LabsenceService,
    private eleveService:EleveService,
    public dialogRef: MatDialogRef<LabsenceDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  get f() { return this.labsenceForm.controls; }

  ngOnInit(): void {
    this.labsenceForm = this.fb.group({
      statut: ["PRESENT",[Validators.required]],
      eleveId: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        statut: formData.statut,
        eleveId: formData.eleve.id
      }
      this.labsenceForm.patchValue(data);
    }
    let formData = this.dialogData.data;
   console.log(formData);
   
    this.getEleves();
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
  console.log(this.labsenceForm.value);
  
  // if(this.dialogAction === 'Edit'){
  //   this.edit();
  // }else{
  //   this.add();
  // }
}


}
