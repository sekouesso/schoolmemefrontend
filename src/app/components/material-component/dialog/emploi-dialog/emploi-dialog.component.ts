import { Component, EventEmitter, Inject } from '@angular/core';
import { EmploiService } from '../../../../services/emploi.service';
import { LemploiService } from '../../../../services/lemploi.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { EnseignantService } from '../../../../services/enseignant.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { HoraireService } from '../../../../services/horaire.service';
import { JourService } from '../../../../services/jour.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-emploi-dialog',
  templateUrl: './emploi-dialog.component.html',
  styleUrl: './emploi-dialog.component.scss'
})
export class EmploiDialogComponent {
  num: any;
  code: any;
  onAddEmploi = new EventEmitter();
  onEditEmploi = new EventEmitter();
  emploiForm:any = FormGroup;
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
  horaires: any;
  jours: any;
  lemploisarray!: FormArray<any> ;
  filteroptions !: Observable<any[]>
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public enseignantService:EnseignantService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private emploiService:EmploiService,
    private lemploiService:LemploiService,
    private horaireService:HoraireService,
    private jourService:JourService,
    public dialogRef: MatDialogRef<EmploiDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.emploiForm.controls }


  get getLemplois() {
    return this.emploiForm.get("lemplois") as FormArray;
  }

  createlemploirow() {
   return this.fb.group({    
      jourId: ['', [Validators.required]],
      horaireId: ['', [Validators.required]],
      enseignantId: ['', [Validators.required]]
    });
  }
  addlemplois() {
    // const associate = this.emploiForm.value.id;
    // if (associate != '') {
      this.lemploisarray = this.emploiForm.controls.lemplois as FormArray;
      this.lemploisarray.push(this.createlemploirow())
    // } else {
    //   alert('Please choose associate')
    // }
  }

  removeEmploi(index: any) {
    if (confirm('do you want to remove this emploi?')) {
      const control = this.emploiForm.controls.lemplois as FormArray;
      control.removeAt(index)
    }
  }

  autochange(index: any) {
    this.lemploisarray = this.emploiForm.get("lemplois") as FormArray;
    const addobj = this.lemploisarray.at(index) as FormGroup;
    const _control = addobj.get("jourId") as FormControl;
    this.filteroptions = _control.valueChanges.pipe(
      startWith(''), map(value => this._Listfilter(_control.value || ''))
    )
console.log(this.filteroptions);

  }
  private _Listfilter(value: string): any[] {
    const searchvalue = value.toLocaleLowerCase();
    return this.jours.filter((option:any) => option.libelle.toLocaleLowerCase().includes(searchvalue) );
  }
 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.emploiForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],     
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      lemplois: this.fb.array([])
    });
if(!this.dialogData.data){
  this.emploiService.getNumero(this.annee).subscribe(
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
          
      this.emploiForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      let lempp: any = [];
      formData.lemplois.forEach((lp: any) =>{
        let ep: any ={};
        ep.jourId = lp.jour.id;
        ep.horaireId = lp.horaire.id;
        ep.enseignantId = lp.enseignant.id;
        lempp.push(ep);
      })
      if (formData.lemplois != null) {
        for (let i = 0; i < formData.lemplois.length; i++) {
          this.addlemplois();
        }
      }
      
      var data = {
        numero: formData.numero,
        annee: formData.annee,
        anneScolaireId: formData.anneScolaire.id,
        classeId: formData.classe.id,
        lemplois:lempp,
      }
      this.emploiForm.patchValue(data);
    }

    this.getAnneScolaires();
    this.getClasses();
    this.getEnseignants();
    this.getHoraires();
    this.getJours();
    
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
  getJours() {
    this.jourService.getAll().subscribe({
      next:(response:any) => {
        this.jours = response;
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
  var formData = this.emploiForm.value;
  var data = {
    numero: formData.numero,
    annee: formData.annee,
    anneScolaireId: formData.anneScolaireId,
    classeId: formData.classeId,
    lemploiDtos: formData.lemplois
  };
  
  this.emploiService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddEmploi.emit();
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
  var formData = this.emploiForm.value;
  var data = {
    id: this.dialogData.data.id,
    annee: formData.annee,
    numero: formData.numero,
    anneScolaireId: formData.anneScolaireId,
    classeId: formData.classeId,
    lemploiDtos: formData.lemplois
  }
  this.emploiService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditEmploi.emit();
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
