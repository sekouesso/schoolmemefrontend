import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { AbsenceService } from '../../../../services/absence.service';
import { HoraireService } from '../../../../services/horaire.service';
import { EleveService } from '../../../../services/eleve.service';

@Component({
  selector: 'app-absence-dialog',
  templateUrl: './absence-dialog.component.html',
  styleUrl: './absence-dialog.component.scss'
})
export class AbsenceDialogComponent {
  num: any;
  code: any;
  onAddAbsence = new EventEmitter();
  onEditAbsence = new EventEmitter();
  absenceForm:any = FormGroup;
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
  typenotes: any;
  trimestres: any;
  trimestreobj= [
    {id:"PREMIER TRIMESTRE",name:"PREMIER TRIMESTRE"},
    {id:"DEUXIEME TRIMESTRE",name:"DEUXIEME TRIMESTRE"},
    {id:"TROISIEME TRIMESTRE",name:"TROISIEME TRIMESTRE"}
  ];

  semestreobj= [
    {id:"PREMIER SEMESTRE",name:"PREMIER SEMESTRE"},
    {id:"DEUXIEME SEMESTRE",name:"DEUXIEME SEMESTRE"}
  ];
  horaires: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private absenceService:AbsenceService,
    private horaireService:HoraireService,
    private eleveService: EleveService,
    public dialogRef: MatDialogRef<AbsenceDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.absenceForm.controls }

 onSelectedClasse(id: any) {
 this.getClasseById(id);
 this.getElevesByClasseId(id);
  
 }


 getClasseById(classeId:any){
  this.classeService.getById(classeId).subscribe({
    next: (data: any) =>{
      let cycle = data.niveau.cycle.libelle;
      if(cycle ==='CYCLE_I' || cycle ==='PRIMAIRE') {
        this.trimestres = this.trimestreobj;
      }else{
        this.trimestres = this.semestreobj;
      }    
    },
    error: (error: any) =>{
      console.log(error);
      
    }
  });
 }


 getElevesByClasseId(classeId: any){
  this.eleveService.getAllByClasseId(classeId).subscribe({
    next: (data: any) =>{
      this.eleves = data;   
    },
    error: (error: any) =>{
      console.log(error);
      
    }
  });
 }

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.absenceForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      semestre:[null,[Validators.required]],
      dateJour: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]],      
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      horaireId: ['', [Validators.required]],
      labsences: [[], [Validators.required]]
    });
if(!this.dialogData.data){
  this.absenceService.getNumero(this.annee).subscribe(
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
          
      this.absenceForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      console.log(formData);
      
      var data = {
        numero: formData.numero,
        dateJour: formData.dateJour,
        annee: formData.annee,
        semestre: formData.semestre,
        anneScolaireId: formData.anneScolaire.id,
        enseignantId: formData.enseignant.id,
        horaireId: formData.horaire.id,
        classeId: formData.classe.id
      }
      
      this.absenceForm.patchValue(data);
    }

    this.getEnseignants();
    this.getHoraires();
    this.getAnneScolaires();
    this.getClasses();
    
  }

  getHoraires() {
    this.horaireService.getAll().subscribe({
      next:(response:any) => {
        this.horaires = response
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

 
handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.absenceForm.value;
  
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    dateJour: formData.dateJour,
    annee: formData.annee,
    semestre: formData.semestre,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    horaireId: formData.horaireId,
    classeId: formData.classeId
  };
  
  this.absenceService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddAbsence.emit();
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
  var formData = this.absenceForm.value;
  var data = {
    numero: formData.numero,
    dateJour: formData.dateJour,
    annee: formData.annee,
    semestre: formData.semestre,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    horaireId: formData.horaireId,
    classeId: formData.classeId
  }
  this.absenceService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditAbsence.emit();
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
