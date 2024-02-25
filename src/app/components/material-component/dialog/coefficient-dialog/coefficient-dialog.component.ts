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
import { CoefficientService } from '../../../../services/coefficient.service';
import { MatiereService } from '../../../../services/matiere.service';
import { ClasseService } from '../../../../services/classe.service';

@Component({
  selector: 'app-coefficient-dialog',
  templateUrl: './coefficient-dialog.component.html',
  styleUrl: './coefficient-dialog.component.scss'
})
export class CoefficientDialogComponent {
  num: any;
  code: any;
  onAddCoefficient = new EventEmitter();
  onEditCoefficient = new EventEmitter();
  coefficientForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  cycles: any;
  anneScolaires: any;
  classes: any;
  matieres: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public coefficientService:CoefficientService,
    private matiereService:MatiereService,
    private classeService:ClasseService,
    public dialogRef: MatDialogRef<CoefficientDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.coefficientForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.coefficientForm = this.fb.group({
      code: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      matiereId: ['', [Validators.required]],      
      coef: [0, [Validators.required]]
    });
if(!this.dialogData.data){
  this.coefficientService.getNumero().subscribe(
    response => {
      this.num = response;
      this.code = (1000 + this.num + 1).toString().substring(1);
      this.coefficientForm.controls.code.setValue(this.code);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        coef: formData.coef,
        code: formData.code,
        classeId: formData.classe.id,
        matiereId: formData.matiere.id
      }
      
      this.coefficientForm.patchValue(data);
    }

    this.getClasses();
    this.getMatieres();
    
  }
  getMatieres() {
    this.matiereService.getAllMatieres().subscribe({
      next:(response:any) => {
        this.matieres = response
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
  getClasses() {
    this.classeService.getAll().subscribe({
      next:(response:any) => {
        this.classes = response
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
  var formData = this.coefficientForm.value;
  var data = {
    coef: formData.coef,
        code: formData.code,
        classeId: formData.classeId,
        matiereId: formData.matiereId
  }
  this.coefficientService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddCoefficient.emit();
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
  var formData = this.coefficientForm.value;
  var data = {
    id: this.dialogData.data.id,
    coef: formData.coef,
        code: formData.code,
        classeId: formData.classeId,
        matiereId: formData.matiereId
  }
  this.coefficientService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditCoefficient.emit();
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
