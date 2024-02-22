import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatiereService } from '../../../../services/matiere.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-enseignant-dialog',
  templateUrl: './enseignant-dialog.component.html',
  styleUrl: './enseignant-dialog.component.scss'
})
export class EnseignantDialogComponent {

  onAddEnseignant = new EventEmitter();
  onEditEnseignant = new EventEmitter();
  enseignantForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  matieres:any

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private enseignantService:EnseignantService,
    private matiereService:MatiereService,
    public dialogRef: MatDialogRef<EnseignantDialogComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    this.enseignantForm = this.fb.group({
      nom: [null,[Validators.required,Validators.pattern(GlobalConstants.nomRegex)]],
      prenom: [null,[Validators.required,Validators.pattern(GlobalConstants.nomRegex)]],
      email: [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      telephone: [null,[Validators.required,Validators.pattern(GlobalConstants.telephoneRegex)]],
      sexe: [null,[Validators.required]],
      datenaissance: [null,[Validators.required]],
      matiere: [null,[Validators.required]],
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      console.log(formData);
      
      var data = {
        nom: formData.nom,
        prenom: formData.prenom,
        matiere: formData.matiere.id,
        datenaissance: formData.datenaissance,
        telephone: formData.telephone,
        sexe: formData.sexe,
        email: formData.email
      }
      console.log(data);
      
      this.enseignantForm.patchValue(data);
    }
    this.getMatieres();
  }

  getMatieres(){
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


handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.enseignantForm.value;
  var data = {
    nom: formData.nom,
    prenom: formData.prenom,
    matiere: formData.matiere,
    datenaissance: formData.datenaissance,
    telephone: formData.telephone,
    sexe: formData.sexe,
    email: formData.email
  }
  console.log(data);
  
  this.enseignantService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddEnseignant.emit();
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
  var formData = this.enseignantForm.value;
  var data = {
    id: this.dialogData.data.id,
    nom: formData.nom,
    prenom: formData.prenom,
    matiere: formData.matiere,
    datenaissance: formData.datenaissance,
    telephone: formData.telephone,
    sexe: formData.sexe,
    email: formData.email
  }
  console.log(data);
  
  this.enseignantService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditEnseignant.emit();
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
