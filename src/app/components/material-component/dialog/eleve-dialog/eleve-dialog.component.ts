import { Component, EventEmitter, Inject } from '@angular/core';
import { GlobalConstants } from '../../../../shared/global-constants';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { CycleService } from '../../../../services/cycle.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TarifsService } from '../../../../services/tarifs.service';
import { TarifsDialogComponent } from '../tarifs-dialog/tarifs-dialog.component';
import { EleveService } from '../../../../services/eleve.service';
import { UserService } from '../../../../services/user.service';
import { ClasseService } from '../../../../services/classe.service';

@Component({
  selector: 'app-eleve-dialog',
  templateUrl: './eleve-dialog.component.html',
  styleUrl: './eleve-dialog.component.scss'
})
export class EleveDialogComponent {
  num: any;
  code: any;
  onAddEleve = new EventEmitter();
  onEditEleve = new EventEmitter();
  eleveForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  cycles: any;
  anneScolaires: any;
  numero: any;
  classes: any;
  parents: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public eleveService:EleveService,
    private userService:UserService,
    private classeService:ClasseService,
    public dialogRef: MatDialogRef<EleveDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.eleveForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.eleveForm = this.fb.group({
      matricule: ['', [Validators.required]],
      annee: [this.annee, [Validators.required]],
      nom:[null,[Validators.required, Validators.pattern(GlobalConstants.nomRegex)]],
      prenom:[null,[Validators.required, Validators.pattern(GlobalConstants.prenomRegex)]],
      telephone:[null,[Validators.required, Validators.pattern(GlobalConstants.telephoneRegex)]],
      datenaissance: ['', [Validators.required]],
      lieunaissance: ['', [Validators.required]],      
      sexe: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      parentId: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.eleveService.getNumero(this.annee).subscribe(
    response => {
      this.numero = response;
      if (this.numero == 0)
      {
        this.numero = (this.annee * 10000) +  1;
      }
      else
      {
        this.numero =  this.numero + 1;
      }
          
      this.eleveForm.controls.matricule.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        matricule: formData.matricule,
        telephone: formData.telephone,
        nom: formData.nom,
        annee: formData.annee,
        prenom: formData.prenom,
        datenaissance: formData.datenaissance,
        lieunaissance: formData.lieunaissance,
        sexe: formData.sexe,
        classeId: formData.classe.id,
        parentId: formData.parent.id
      } 
      this.eleveForm.patchValue(data);
    }

    this.getParents();
    this.getClasses();
    
  }
  getParents() {
    this.userService.getUsers().subscribe({
      next:(response:any) => {
        this.parents = response
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
  var formData = this.eleveForm.value;
  var data = {
    matricule: formData.matricule,
        telephone: formData.telephone,
        nom: formData.nom,
        annee: formData.annee,
        prenom: formData.prenom,
        datenaissance: formData.datenaissance,
        lieunaissance: formData.lieunaissance,
        sexe: formData.sexe,
        classeId: formData.classeId,
        parentId: formData.parentId
  }
  
  this.eleveService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddEleve.emit();
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
  var formData = this.eleveForm.value;
  var data = {
    id: this.dialogData.data.id,
    matricule: formData.matricule,
        telephone: formData.telephone,
        nom: formData.nom,
        annee: formData.annee,
        prenom: formData.prenom,
        datenaissance: formData.datenaissance,
        lieunaissance: formData.lieunaissance,
        sexe: formData.sexe,
        classeId: formData.classeId,
        parentId: formData.parentId
  }
  this.eleveService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditEleve.emit();
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
