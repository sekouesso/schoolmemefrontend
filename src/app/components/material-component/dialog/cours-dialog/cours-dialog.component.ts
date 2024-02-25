import { Component, EventEmitter, Inject } from '@angular/core';
import { CoursService } from '../../../../services/cours.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { HoraireService } from '../../../../services/horaire.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';

@Component({
  selector: 'app-cours-dialog',
  templateUrl: './cours-dialog.component.html',
  styleUrl: './cours-dialog.component.scss'
})
export class CoursDialogComponent {
  
  num: any;
  code: any;
  onAddCours = new EventEmitter();
  onEditCours = new EventEmitter();
  coursForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  anneScolaires: any;
  numero: any;
  classes: any;
  eleves: any;
  enseignants: any;
  horaires: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private coursService:CoursService,
    private horaireService:HoraireService,
    public dialogRef: MatDialogRef<CoursDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.coursForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.coursForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      trimestre:[null,[Validators.required]],
      datecours: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]],      
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      horaireId: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.coursService.getNumero(this.annee).subscribe(
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
          
      this.coursForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        numero: formData.numero,
        datecours: formData.datecours,
        annee: formData.annee,
        trimestre: formData.trimestre,
        anneScolaireId: formData.anneScolaire.id,
        enseignantId: formData.enseignant.id,
        horaireId: formData.horaire.id,
        classeId: formData.classe.id
      }
      
      this.coursForm.patchValue(data);
    }

    this.getEnseignants();
    this.getHoraires();
    this.getAnneScolaires();
    this.getClasses();
    
  }
  getEnseignants() {
    this.enseignantService.getAllEnseignant().subscribe({
      next:(response:any) => {
        this.enseignants = response;
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
  getAnneScolaires() {
    this.anneScolaireService.getAll().subscribe({
      next:(response:any) => {
        this.anneScolaires = response
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

  getHoraires() {
    this.horaireService.getAll().subscribe({
      next:(response:any) => {
        this.horaires = response;
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
  var formData = this.coursForm.value;
  var data = {
    numero: formData.numero,
    datecours: formData.datecours,
    annee: formData.annee,
    trimestre: formData.trimestre,
    anneScolaire: formData.anneScolaireId,
    enseignant: formData.enseignantId,
    horaire: formData.horaireId,
    classe: formData.classeId
  };
  
  this.coursService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddCours.emit();
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
  var formData = this.coursForm.value;
  
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    datecours: formData.datecours,
    annee: formData.annee,
    trimestre: formData.trimestre,
    anneScolaire: formData.anneScolaireId,
    enseignant: formData.enseignantId,
    horaire: formData.horaireId,
    classe: formData.classeId
  };
  this.coursService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditCours.emit();
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
