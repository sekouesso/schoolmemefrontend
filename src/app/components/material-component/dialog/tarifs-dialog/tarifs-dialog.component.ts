import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TarifsService } from '../../../../services/tarifs.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../../../shared/global-constants';
import { AnneScolaireService } from '../../../../services/anne-scolaire.service';
import { CycleService } from '../../../../services/cycle.service';

@Component({
  selector: 'app-tarifs-dialog',
  templateUrl: './tarifs-dialog.component.html',
  styleUrl: './tarifs-dialog.component.scss'
})
export class TarifsDialogComponent {

  num: any;
  code: any;
  onAddTarifs = new EventEmitter();
  onEditTarifs = new EventEmitter();
  tarifForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  date:   any;
  annee: any;
  cycles: any;
  anneScolaires: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public tarifService:TarifsService,
    private cycleService:CycleService,
    private anneScolaireService:AnneScolaireService,
    public dialogRef: MatDialogRef<TarifsDialogComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ){}

  get f() { return this.tarifForm.controls }

  selectFrais(value: any) {
    // console.log(value.value);
    let fraisTotal = value.value;
    if(fraisTotal!==""){
      this.tarifForm.controls.montant1.setValue(0.5*parseFloat(fraisTotal));
      this.tarifForm.controls.montant2.setValue(0.3*parseFloat(fraisTotal));
      this.tarifForm.controls.montant3.setValue(0.2*parseFloat(fraisTotal));
    }
    }

  ngOnInit(): void {
      this.date = this.transformDate(new Date());
      this.annee = (this.date).toString().substring(0, 4);
    this.tarifForm = this.fb.group({
      id: null,
      code: ['', [Validators.required]],
      cycleId: ['', [Validators.required]],
      anneScolaireId: ['', [Validators.required]],      
      annee: [this.annee, [Validators.required]],
      montant1: [0, [Validators.required]],
      montant2: [0, [Validators.required]],
      montant3: [0, [Validators.required]],
      frais: [0, [Validators.required]],
      date1: ['', [Validators.required]],
      date2: ['', [Validators.required]],
      date3: ['', [Validators.required]],
      date4: ['', [Validators.required]],
      montant: [0, [Validators.required]]
    });
if(!this.dialogData.data){
  this.tarifService.getNumero().subscribe(
    response => {
      this.num = response;
      this.code = (1000 + this.num + 1).toString().substring(1);
      this.tarifForm.controls.code.setValue(this.code);
    }
  );
}
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      let formData = this.dialogData.data;
      var data = {
        date1: formData.date1,
        date2: formData.date2,
        annee: formData.annee,
        date3: formData.date3,
        frais: formData.frais,
        code: formData.code,
        date4: formData.date4,
        montant: formData.montant,
        montant1: formData.montant1,
        montant2: formData.montant2,
        montant3: formData.montant3,
        cycleId: formData.cycle.id,
        anneScolaireId: formData.anneScolaire.id
      }
      
      this.tarifForm.patchValue(data);
    }

    this.getCycles();
    this.getAnneScolaires();
    
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
  getCycles() {
    this.cycleService.getAll().subscribe({
      next:(response:any) => {
        this.cycles = response
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
  var formData = this.tarifForm.value;
  var data = {
    date1: formData.date1,
    date2: formData.date2,
    frais: formData.frais,
    annee: formData.annee,
    code: formData.code,
    date3: formData.date3,
    date4: formData.date4,
    montant: formData.montant,
    montant1: formData.montant1,
    montant2: formData.montant2,
    montant3: formData.montant3,
    cycleId: formData.cycleId,
    anneScolaireId: formData.anneScolaireId
  }
  this.tarifService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddTarifs.emit();
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
  var formData = this.tarifForm.value;
  var data = {
    id: this.dialogData.data.id,
    date1: formData.date1,
    frais: formData.frais,
    annee: formData.annee,
    code: formData.code,
    date2: formData.date2,
    date3: formData.date3,
    date4: formData.date4,
    montant: formData.montant,
    montant1: formData.montant1,
    montant2: formData.montant2,
    montant3: formData.montant3,
    cycleId: formData.cycleId,
    anneScolaireId: formData.anneScolaireId
  }
  this.tarifService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditTarifs.emit();
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
