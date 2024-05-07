import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClasseService } from '../../../../services/classe.service';
import { EleveService } from '../../../../services/eleve.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { UserService } from '../../../../services/user.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { EleveDialogComponent } from '../eleve-dialog/eleve-dialog.component';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { InscriptionService } from '../../../../services/inscription.service';
import { TarifsService } from '../../../../services/tarifs.service';

@Component({
  selector: 'app-inscription-dialog',
  templateUrl: './inscription-dialog.component.html',
  styleUrl: './inscription-dialog.component.scss'
})
export class InscriptionDialogComponent {


  num: any;
  code: any;
  onAddInscription = new EventEmitter();
  onEditInscription = new EventEmitter();
  inscriptionForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  anneScolaires: any;
  numero: any;
  classes: any;
  eleves: any;
  niveauId: any;
  anneScoId: any;
  fraisInscription: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public eleveService:EleveService,
    private anneScolaireService:AnneScolaireService,
    private classeService:ClasseService,
    private inscriptionService:InscriptionService,
    private tarifsService:TarifsService,
    public dialogRef: MatDialogRef<InscriptionDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.inscriptionForm.controls }

  selectedAnnee(anneeId: any) {
    this.anneScoId = anneeId;
    console.log(anneeId);
    
    }
    selectedNiveau(eleveId: any) {
      console.log(eleveId);
      
      this.eleveService.getById(eleveId).subscribe({
        next:(response:any) => {
          this.niveauId = response.classe.niveau.id;
          this.tarifsService.getFraisInscription(this.niveauId,this.anneScoId).subscribe({
            next:(response:any) => {
              this.fraisInscription = response;
              this.inscriptionForm.controls.montant.setValue(this.fraisInscription);
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

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.inscriptionForm = this.fb.group({
      annee: [this.annee, [Validators.required]],
      numero:[null,[Validators.required]],
      montant:[null,[Validators.required]],
      dateInscription: ['', [Validators.required]],      
      anneScolaireId: ['', [Validators.required]],
      classeId: ['', [Validators.required]],
      eleveId: ['', [Validators.required]]
    });
if(!this.dialogData.data){
  this.inscriptionService.getNumero(this.annee).subscribe(
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
          
      this.inscriptionForm.controls.numero.setValue(this.numero);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        numero: formData.numero,
        dateInscription: formData.dateInscription,
        annee: formData.annee,
        montant: formData.montant,
        anneScolaireId: formData.anneScolaire.id,
        eleveId: formData.eleve.id,
        classeId: formData.classe.id
      }
      
      this.inscriptionForm.patchValue(data);
    }

    this.getEleves();
    this.getAnneScolaires();
    this.getClasses();
    
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
  var formData = this.inscriptionForm.value;
  var data = {
    numero: formData.numero,
    dateInscription: formData.dateInscription,
    annee: formData.annee,
    montant: formData.montant,
    anneScolaireId: formData.anneScolaireId,
    eleveId: formData.eleveId,
    classeId: formData.classeId
  }
  this.inscriptionService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddInscription.emit();
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
  var formData = this.inscriptionForm.value;
  var data = {
    numero: formData.numero,
    dateInscription: formData.dateInscription,
    annee: formData.annee,
    montant: formData.montant,
    anneScolaireId: formData.anneScolaireId,
    eleveId: formData.eleveId,
    classeId: formData.classeId
  }
  this.inscriptionService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditInscription.emit();
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
