import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EmploiService } from '../../../../services/emploi.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EmploiDialogComponent } from '../emploi-dialog/emploi-dialog.component';

@Component({
  selector: 'app-emlpoi-eleve-dialog',
  templateUrl: './emlpoi-eleve-dialog.component.html',
  styleUrl: './emlpoi-eleve-dialog.component.scss'
})
export class EmlpoiEleveDialogComponent {
  displayColumns: string[]=['jour','horaire','enseignant','matiere'];
  dataSource:any;
  length:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  classeId: any;
  anneScolaireId: any;
  emploi: any;
  dialogInfos: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private emploiService: EmploiService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    console.log(this.dialogData.action);
    this.dialogInfos = this.dialogData.action;
    this.classeId = this.dialogData.data.classe.id;
    this.anneScolaireId = this.dialogData.data.anneScolaire.id;
    this.tableData();
  }

  tableData() {
    this.emploiService.getByClasseIdAndAnneScolaireId(this.classeId,this.anneScolaireId).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      console.log(response);
      this.emploi = response;
      this.dataSource = new MatTableDataSource(response.lemplois);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort;
      console.log(response);
      
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

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add',
    };
    dialogConfig.width = '700px';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(EmploiDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddEmploi.subscribe((response) => {
      this.tableData();
    });
    }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Edit',
      data: values
    };
    dialogConfig.width = '700px';
    const dialogRef = this.dialog.open(EmploiDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditEmploi.subscribe((response) => {
      this.tableData();
    });
    }
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+values.numero+' emploi',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
    }

    delete(id:any){
      this.emploiService.delete(id).subscribe({next:(response:any)=>{
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackbar(this.responseMessage,'success');
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
}
