import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { EvaluationService } from '../../../../services/evaluation.service';
import { NoteService } from '../../../../services/note.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { EleveService } from '../../../../services/eleve.service';
import { CoefficientService } from '../../../../services/coefficient.service';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss'
})
export class NoteDialogComponent {
  num: any;
  code: any;
  onAddNote = new EventEmitter();
  onEditNote = new EventEmitter();
  noteForm:any = FormGroup;
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
  trimestreobj= ["PREMIER TRIMESTRE","DEUXIEME TRIMESTRE","TROISIEME TRIMESTRE"];
  
  semestreobj= ["PREMIER SEMESTRE", "DEUXIEME SEMESTRE"];
  evaluations: any;
  dataSource: any;
  coefficient: any;
  lnotes!: FormArray<any>;
  enseignant: any;
  matiereId: any;
  editable: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private noteService:NoteService,
    private eleveService:EleveService,
    private coefficientService:CoefficientService,
    private evaluationService:EvaluationService,
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.noteForm.controls }

  onSelectedClasse(classeId: any) {
    this.getClasseById(classeId);
    // this.getElevesByClasseId(classeId);

    this.eleveService.getAllByClasseId(classeId).subscribe({
      next: (response: any) =>{
        this.eleves = response;
        if (this.eleves != null) {
          this.eleves.forEach((eleve:any )=>{
            this.addlnotesDtos(eleve.id);
          })
          // for (let i = 0; i < this.eleves.length; i++) {
          //   this.addlnotesDtos();
          // }
        }
         console.log(this.noteForm.value);
         console.log(this.eleves);
      },
      error: (error: any) =>{
        console.log(error);
        
      }
    });

     
    }

    
    onSelectedMatiere(enseignantId: any) {
      this.enseignantService.getById(enseignantId).subscribe({
        next: (response: any) =>{
          this.enseignant = response;
          this.matiereId = response.matiere.id;
          let classeId = this.noteForm.value.classeId;
          console.log(classeId,this.matiereId);
          this.geCoefficientByClasseIdAndMatiereId(classeId, this.matiereId); 
        },
        error: (error: any) =>{
          console.log(error);
        }
      });

      }

    getEnseignant(enseignantId: any) {
      this.enseignantService.getById(enseignantId).subscribe({
        next: (response: any) =>{
          this.enseignant = response;
        },
        error: (error: any) =>{
          console.log(error);
        }
      });
    }

    geCoefficientByClasseIdAndMatiereId (classeId: any,matiereId:any) {
      this.coefficientService.getCoefficient(classeId,matiereId).subscribe({
        next: (response: any) =>{
          console.log(response);
          
          this.coefficient = response;
          this.noteForm.controls['coefficient'].setValue(this.coefficient);
        },
        error: (error: any) =>{
          console.log(error);
          
        }
      });
    }

    get getLnotesDtos() {
      return this.noteForm.get("lnotesDtos") as FormArray;
    }
  
    createlnotesDtosrow(eleveId:any) {
     return this.fb.group({    
        eleveId: [eleveId, [Validators.required]],
        moy: [0, [Validators.required,Validators.min(0),Validators.max(20)]]
      });
    }
    addlnotesDtos(eleveId:any)  {
        this.lnotes = this.noteForm.controls.lnotesDtos as FormArray;
        this.lnotes.push(this.createlnotesDtosrow(eleveId));
        
    }

    addlnotesDtosupdate()  {
      this.lnotes = this.noteForm.controls.lnotesDtos as FormArray;
      this.lnotes.push(this.fb.group({    
        eleveId: ['', [Validators.required]],
        moy: ['', [Validators.required]]
      }));
      
  }
  
    removelnotesDtos(index: any) {
      if (confirm('do you want to remove this note?')) {
        const control = this.noteForm.controls.lnotesDtos as FormArray;
        control.removeAt(index)
      }
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
       next: (response: any) =>{
         this.eleves = response;
         this.dataSource = new MatTableDataSource(response);
        //  console.log(this.eleves);
         
       },
       error: (error: any) =>{
         console.log(error);
         
       }
     });
    }

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.noteForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      semestre:[null,[Validators.required]],
      coefficient: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]],      
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      evaluationId: ['', [Validators.required]],
      lnotesDtos: this.fb.array([])
    });
if(!this.dialogData.data){
  this.noteService.getNumero(this.annee).subscribe(
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
          
      this.noteForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';

      let formData = this.dialogData.data;
    console.log(formData);
    // console.log("Ok");
    
// console.log(formData.lnotes.sort((a:any, b:any) => a.eleve.nom.trim().toLowerCase() - b.eleve.nom.trim().toLowerCase() ));

      let lempp: any = [];
      formData.lnotes.forEach((lp: any) =>{
        let ep: any ={};
        ep.eleveId = lp.eleve.id;
        ep.moy = lp.moy;
        lempp.push(ep);
      })
      console.log(lempp);
      
      this.noteForm.lnotesDtos=lempp;
      if (formData.lnotes != null) {
        console.log(this.noteForm.lnotesDtos);
         this.getElevesByClasseId(formData.classe.id);

        // this.eleveService.getAllByClasseId(formData.classe.id).subscribe({
        //   next: (response: any) =>{
        //     this.eleves = response;
            
        //      console.log(this.noteForm.value);
        //      console.log(this.eleves);
        //     console.log(this.noteForm.lnotesDtos,lempp);
            
           


        //   },
        //   error: (error: any) =>{
        //     console.log(error);
            
        //   }
        // });

       
      }
      // console.log(formData);
      
      lempp.forEach((eleve:any )=>{
        console.log(eleve.eleveId);
        this.addlnotesDtos(eleve.eleveId);
        // this.addlnotesDtosupdate();
        
      });

      var data = {
        numero: formData.numero,
    annee: formData.annee,
    coefficient: formData.coefficient,
    semestre: formData.semestre,
    evaluationId: formData.evaluation.id,
    anneScolaireId: formData.anneScolaire.id,
    enseignantId: formData.enseignant.id,
    classeId: formData.classe.id,
    lnotesDtos:lempp
      }
      this.getClasseById(data.classeId);
      console.log(data);
      this.noteForm.setValue(data);
      
      // this.noteForm.patchValue(data);
    }

    this.getEnseignants();
    this.getEvaluations();
    this.getAnneScolaires();
    this.getClasses();
    
  }

  getEvaluations() {
    this.evaluationService.getAll().subscribe({
      next:(response:any) => {
        this.evaluations = response
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
  // console.log(this.noteForm.value);
  
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.noteForm.value;
  var data = {
    numero: formData.numero,
    annee: formData.annee,
    coefficient: formData.coefficient,
    semestre: formData.semestre,
    evaluationId: formData.evaluationId,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    classeId: formData.classeId,
    lnotesDtos: formData.lnotesDtos,
  };
  
  this.noteService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddNote.emit();
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
  var formData = this.noteForm.value;
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    annee: formData.annee,
    coefficient: formData.coefficient,
    semestre: formData.semestre,
    evaluationId: formData.evaluationId,
    anneScolaireId: formData.anneScolaireId,
    enseignantId: formData.enseignantId,
    classeId: formData.classeId,
    lnotesDtos: formData.lnotesDtos,
  }
  this.noteService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditNote.emit();
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
