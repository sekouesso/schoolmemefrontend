import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { ReglementService } from '../../../../services/reglement.service';
import { TarifsService } from '../../../../services/tarifs.service';

@Component({
  selector: 'app-reglement-eleve-dialog',
  templateUrl: './reglement-eleve-dialog.component.html',
  styleUrl: './reglement-eleve-dialog.component.scss'
})
export class ReglementEleveDialogComponent {
  displayColumns: string[]=['nom','date','montant'];
  dataSource:any;
  length:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  classeId: any;
  anneScolaireId: any;
  emploi: any;
  dialogInfos: any;
  eleveId: any;
  ecolage: any;
  cycleId: any;
  cumulReglement=0;
  rest: number=0;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private reglementService: ReglementService,
    private tarifsService: TarifsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    console.log(this.dialogData.data);
    this.dialogInfos = this.dialogData.action;
    console.log(this.dialogInfos);
    this.eleveId = this.dialogData.data.id;
    this.anneScolaireId = this.dialogData.data.anneScolaire.id;
    this.cycleId = this.dialogData.data.classe.niveau.cycle.id;
    console.log(this.cycleId,this.anneScolaireId);
    

    
    
    this.tableData();
    
    
  }

  tableData() {
    this.reglementService.getAllByEleveIdAndAnneScolaireId(this.eleveId,this.anneScolaireId).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort;
    response.map((reglement:any) => {
      this.cumulReglement += reglement.montant;
      
    });
    this.tarifsService.getEcolage(this.cycleId,this.anneScolaireId).subscribe({
      next:(response:any) => {
        this.ecolage = response;
        this.rest    = this.ecolage-this.cumulReglement;
        
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
    });
    },
    error:(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }
  });
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getEcolage() {
    this.tarifsService.getEcolage(this.cycleId,this.anneScolaireId).subscribe({
      next:(response:any) => {
        this.ecolage = response;
        console.log(this.ecolage);
        
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
}
