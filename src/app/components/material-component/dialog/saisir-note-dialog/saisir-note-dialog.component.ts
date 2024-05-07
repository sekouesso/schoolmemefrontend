import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { CoefficientService } from '../../../../services/coefficient.service';
import { EleveService } from '../../../../services/eleve.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { EvaluationService } from '../../../../services/evaluation.service';
import { MatiereService } from '../../../../services/matiere.service';
import { NoteService } from '../../../../services/note.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { SaisirNoteService } from '../../../../services/saisir-note.service';

@Component({
  selector: 'app-saisir-note-dialog',
  templateUrl: './saisir-note-dialog.component.html',
  styleUrl: './saisir-note-dialog.component.scss'
})
export class SaisirNoteDialogComponent {
  num: any;
  code: any;
  onAddSaisirNote = new EventEmitter();
  onEditSaisirNote = new EventEmitter();
  saisirnoteForm:any = FormGroup;
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
  lsaisirnotes!: FormArray<any>;
  enseignant: any;
  matiereId: any;
  editable: boolean = true;
  matieres: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private saisirnoteService:SaisirNoteService,
    private matiereService:MatiereService,
    private eleveService:EleveService,
    private coefficientService:CoefficientService,
    private evaluationService:EvaluationService,
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.saisirnoteForm.controls }

  onSelectedClasse(classeId: any) {
    this.getClasseById(classeId);
    // this.getElevesByClasseId(classeId);

    this.eleveService.getAllByClasseId(classeId).subscribe({
      next: (response: any) =>{
        this.eleves = response;
        if (this.eleves != null) {
          this.eleves.forEach((eleve:any )=>{
            this.addlsaisirNoteDtos(eleve.id);
          })
          // for (let i = 0; i < this.eleves.length; i++) {
          //   this.addlsaisirNoteDtos();
          // }
        }
         console.log(this.saisirnoteForm.value);
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
          let classeId = this.saisirnoteForm.value.classeId;
          console.log(classeId,this.matiereId);
          // this.geCoefficientByClasseIdAndMatiereId(classeId, this.matiereId); 
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
    

    // geCoefficientByClasseIdAndMatiereId (classeId: any,matiereId:any) {
    //   this.coefficientService.getCoefficient(classeId,matiereId).subscribe({
    //     next: (response: any) =>{
    //       console.log(response);
          
    //       this.coefficient = response;
    //       this.saisirnoteForm.controls['coefficient'].setValue(this.coefficient);
    //     },
    //     error: (error: any) =>{
    //       console.log(error);
          
    //     }
    //   });
    // }

    get getlsaisirNoteDtos() {
      return this.saisirnoteForm.get("lsaisirNoteDtos") as FormArray;
    }
  
    createlsaisirNoteDtosrow(eleveId:any) {
     return this.fb.group({    
        eleveId: [eleveId, [Validators.required]],
        interro: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
        devoir: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
        compos: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
      });
    }
    addlsaisirNoteDtos(eleveId:any)  {
        this.lsaisirnotes = this.saisirnoteForm.controls.lsaisirNoteDtos as FormArray;
        this.lsaisirnotes.push(this.createlsaisirNoteDtosrow(eleveId));
        
    }

  //   addlsaisirNoteDtosupdate()  {
  //     this.lsaisirNote = this.saisirnoteForm.controls.lsaisirNoteDtos as FormArray;
  //     this.lsaisirNote.push(this.fb.group({    
  //       eleveId: [eleveId, [Validators.required]],
  //       interro: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
  //       devoir: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
  //       compos: [0, [Validators.required,Validators.min(0),Validators.max(20)]],
  //     }));  
  // }
  
    removelsaisirNoteDtos(index: any) {
      if (confirm('do you want to remove this note?')) {
        const control = this.saisirnoteForm.controls.lsaisirNoteDtos as FormArray;
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
    this.saisirnoteForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      session:[null,[Validators.required]],
      matiereId: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]],  
      classeId: ['', [Validators.required]],
      lsaisirNoteDtos: this.fb.array([])
    });
if(!this.dialogData.data){
  this.saisirnoteService.getNumero(this.annee).subscribe(
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
          
      this.saisirnoteForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';

      let formData = this.dialogData.data;
    console.log(formData);
    // console.log("Ok");
    
// console.log(formData.lsaisirNote.sort((a:any, b:any) => a.eleve.nom.trim().toLowerCase() - b.eleve.nom.trim().toLowerCase() ));

      let lempp: any = [];
      formData.lsaisirNotes.forEach((lp: any) =>{
        let ep: any ={};
        ep.eleveId = lp.eleve.id;
        ep.interro = lp.interro;
        ep.devoir = lp.devoir;
        ep.compos = lp.compos;
        lempp.push(ep);
      })
      console.log(lempp);
      
      this.saisirnoteForm.lsaisirNoteDtos=lempp;
      if (formData.lsaisirNotes != null) {
        console.log(this.saisirnoteForm.lsaisirNoteDtos);
         this.getElevesByClasseId(formData.classe.id);

        // this.eleveService.getAllByClasseId(formData.classe.id).subscribe({
        //   next: (response: any) =>{
        //     this.eleves = response;
            
        //      console.log(this.saisirnoteForm.value);
        //      console.log(this.eleves);
        //     console.log(this.saisirnoteForm.lsaisirNoteDtos,lempp);
            
           


        //   },
        //   error: (error: any) =>{
        //     console.log(error);
            
        //   }
        // });

       
      }
      // console.log(formData);
      
      lempp.forEach((eleve:any )=>{
        console.log(eleve.eleveId);
        this.addlsaisirNoteDtos(eleve.eleveId);
        // this.addlsaisirNoteDtosupdate();
        
      });

      var data = {
        numero: formData.numero,
    annee: formData.annee,
    session: formData.session,
    matiereId: formData.matiere.id,
    enseignantId: formData.enseignant.id,
    classeId: formData.classe.id,
    lsaisirNoteDtos:lempp
      }
      this.getClasseById(data.classeId);
      console.log(data);
      this.saisirnoteForm.setValue(data);
      
      // this.saisirnoteForm.patchValue(data);
    }

    this.getEnseignants();
    this.getMatieres();
    this.getClasses();
    
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
  // console.log(this.saisirnoteForm.value);
  
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.saisirnoteForm.value;
  var data = {
    numero: formData.numero,
    annee: formData.annee,
    session: formData.session,
    matiereId: formData.matiereId,
    enseignantId: formData.enseignantId,
    classeId: formData.classeId,
    lsaisirNoteDtos: formData.lsaisirNoteDtos,
  };
  
  this.saisirnoteService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddSaisirNote.emit();
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
  var formData = this.saisirnoteForm.value;
  var data = {
    id: this.dialogData.data.id,
    numero: formData.numero,
    annee: formData.annee,
    session: formData.session,
    matiereId: formData.matiereId,
    enseignantId: formData.enseignantId,
    classeId: formData.classeId,
    lsaisirNoteDtos: formData.lsaisirNoteDtos,
  }
  this.saisirnoteService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditSaisirNote.emit();
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
