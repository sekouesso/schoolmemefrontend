import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HoraireDialogComponent } from '../horaire-dialog/horaire-dialog.component';
import { ClasseService } from '../../../../services/classe.service';
import { NiveauService } from '../../../../services/niveau.service';

@Component({
  selector: 'app-classe-dialog',
  templateUrl: './classe-dialog.component.html',
  styleUrl: './classe-dialog.component.scss'
})
export class ClasseDialogComponent {
  num: any;
  code: any;
  onAddClasse = new EventEmitter();
  onEditClasse = new EventEmitter();
  classeForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  niveaux: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public classeService:ClasseService,
    public niveauService:NiveauService,
    public dialogRef: MatDialogRef<HoraireDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.classeForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.classeForm = this.fb.group({
      code: ['', [Validators.required]],      
      libelle: ['', [Validators.required]],
      niveauId: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.classeService.getNumero().subscribe(
    response => {
      this.num = response;
      this.code = (1000 + this.num + 1).toString().substring(1);
      this.classeForm.controls.code.setValue(this.code);
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
        niveauId: formData.niveau.id
      }
      
      this.classeForm.patchValue(data);
    }
    this.getNiveaux();
  }
 
  getNiveaux() {
    this.niveauService.getAll().subscribe({
      next:(response:any) => {
        this.niveaux = response
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
  var formData = this.classeForm.value;
  var data = {
    code: formData.code,
    libelle: formData.libelle,
    niveauId: formData.niveauId
  }
  this.classeService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddClasse.emit();
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
  var formData = this.classeForm.value;
  var data = {
    id: this.dialogData.data.id,
    code: formData.code,
    libelle: formData.libelle,
    niveauId: formData.niveauId
  }
  this.classeService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditClasse.emit();
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
