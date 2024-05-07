import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { ClasseService } from '../../../../services/classe.service';
import { EleveService } from '../../../../services/eleve.service';
import { InscriptionService } from '../../../../services/inscription.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { InscriptionDialogComponent } from '../inscription-dialog/inscription-dialog.component';
import { ReglementService } from '../../../../services/reglement.service';

@Component({
  selector: 'app-reglement-dialog',
  templateUrl: './reglement-dialog.component.html',
  styleUrl: './reglement-dialog.component.scss'
})
export class ReglementDialogComponent {
  num: any;
  code: any;
  onAddReglement = new EventEmitter();
  onEditReglement = new EventEmitter();
  reglementForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  anneScolaires: any;
  numero: any;
  classes: any;
  eleves: any;
  inscriptions: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public eleveService:EleveService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private inscriptionService:InscriptionService,
    private reglementService:ReglementService,
    public dialogRef: MatDialogRef<ReglementDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){
    console.log(this.dialogData);
    
  }

  get f() { return this.reglementForm.controls }

 

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.reglementForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      montant:[null,[Validators.required]],
      dateReglement: [this.date, [Validators.required]],
      inscriptionId: ['', [Validators.required]],      
      anneScolaireId: [this.dialogData.eleve.anneScolaire.id, [Validators.required]],
      classeId: [this.dialogData.eleve.classe.id, [Validators.required]],
      eleveId: [this.dialogData.eleve.id, [Validators.required]]
    });
if(!this.dialogData.data){
  this.reglementService.getNumero(this.annee).subscribe(
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
          
      this.reglementForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        numero: formData.numero,
        dateReglement: formData.dateReglement,
        annee: formData.annee,
        montant: formData.montant,
        anneScolaireId: formData.anneScolaire.id,
        eleveId: formData.eleve.id,
        classeId: formData.classe.id,
        inscriptionId: formData.inscription.id
      }
      
      this.reglementForm.patchValue(data);
    }

    this.getEleves();
    this.getAnneScolaires();
    this.getClasses();
    this.getInscriptions();
    
  }

  getInscriptions() {
    this.inscriptionService.getAll().subscribe({
      next:(response:any) => {
        this.inscriptions = response
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

  getEleves() {
    this.eleveService.getAll().subscribe({
      next:(response:any) => {
        this.eleves = response
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
  var formData = this.reglementForm.value;
  var data = {
    numero: formData.numero,
        dateReglement: formData.dateReglement,
        annee: formData.annee,
        montant: formData.montant,
        anneScolaireId: formData.anneScolaireId,
        eleveId: formData.eleveId,
        classeId: formData.classeId,
        inscriptionId: formData.inscriptionId
  }
  this.reglementService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddReglement.emit();
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
  var formData = this.reglementForm.value;
  var data = {
    numero: formData.numero,
        dateReglement: formData.dateReglement,
        annee: formData.annee,
        montant: formData.montant,
        anneScolaireId: formData.anneScolaireId,
        eleveId: formData.eleveId,
        classeId: formData.classeId,
        inscriptionId: formData.inscriptionId
  }
  this.reglementService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditReglement.emit();
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
