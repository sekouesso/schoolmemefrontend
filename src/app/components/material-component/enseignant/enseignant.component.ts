import { Component, ViewChild } from '@angular/core';
import { GlobalConstants } from '../../../shared/global-constants';
import { FormBuilder } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EnseignantService } from '../../../services/enseignant.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EnseignantDialogComponent } from '../dialog/enseignant-dialog/enseignant-dialog.component';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.scss'
})
export class EnseignantComponent {

  displayColumns: string[]=['nom','telephone','datenaissance','sexe','matiere','edit'];
  dataSource:any;
  length:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private enseignantService: EnseignantService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.enseignantService.getAllEnseignant().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort
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
    const dialogRef = this.dialog.open(EnseignantDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddEnseignant.subscribe((response) => {
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
    const dialogRef = this.dialog.open(EnseignantDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditEnseignant.subscribe((response) => {
      this.tableData();
    });
    }
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+values.nom+' enseignant',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteEnseignant(values.id);
      dialogRef.close();
    });
    }

    deleteEnseignant(id:any){
      this.enseignantService.delete(id).subscribe({next:(response:any)=>{
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
