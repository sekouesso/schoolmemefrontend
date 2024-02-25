import { Component, EventEmitter, Inject } from '@angular/core';
import { TypeNoteService } from '../../../../services/type-note.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { HoraireService } from '../../../../services/horaire.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { EvaluationService } from '../../../../services/evaluation.service';

@Component({
  selector: 'app-evaluation-dialog',
  templateUrl: './evaluation-dialog.component.html',
  styleUrl: './evaluation-dialog.component.scss'
})
export class EvaluationDialogComponent {
  num: any;
  code: any;
  onAddEvaluation = new EventEmitter();
  onEditEvaluation = new EventEmitter();
  evaluationForm:any = FormGroup;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private typenoteService:TypeNoteService,
    private evaluationService:EvaluationService,
    public dialogRef: MatDialogRef<EvaluationDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.evaluationForm.controls }

 onSelectedClasse(id: any) {
  this.classeService.getById(id).subscribe({
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
  })
  
 }

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.evaluationForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      trimestre:[null,[Validators.required]],
      dateEvaluation: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]],      
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      typeNoteId: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.evaluationService.getNumero(this.annee).subscribe(
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
          
      this.evaluationForm.controls.numero.setValue(this.numero);
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
        dateEvaluation: formData.dateEvaluation,
        annee: formData.annee,
        trimestre: formData.trimestre,
        anneScolaireId: formData.anneScolaire.id,
        enseignantId: formData.enseignant.id,
        typeNoteId: formData.typeNote.id,
        classeId: formData.classe.id
      }
      
      this.evaluationForm.patchValue(data);
    }

    this.getEnseignants();
    this.getTypeNotes();
    this.getAnneScolaires();
    this.getClasses();
    
  }

  getTypeNotes() {
    this.typenoteService.getAll().subscribe({
      next:(response:any) => {
        this.typenotes = response
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
  var formData = this.evaluationForm.value;
  
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    dateEvaluation: formData.dateEvaluation,
    annee: formData.annee,
    trimestre: formData.trimestre,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    typeNoteId: formData.typeNoteId,
    classeId: formData.classeId
  };
  
  this.evaluationService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddEvaluation.emit();
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
  var formData = this.evaluationForm.value;
  var data = {
    numero: formData.numero,
    dateEvaluation: formData.dateEvaluation,
    annee: formData.annee,
    trimestre: formData.trimestre,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    typeNoteId: formData.typeNoteId,
    classeId: formData.classeId
  }
  this.evaluationService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditEvaluation.emit();
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
