import { Component, ViewChild } from '@angular/core';
import { GlobalConstants } from '../../../shared/global-constants';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TarifsService } from '../../../services/tarifs.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TarifsDialogComponent } from '../dialog/tarifs-dialog/tarifs-dialog.component';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.scss'
})
export class TarifsComponent {

  displayColumns: string[]=['code','frais','montant','date4','cycle','anneScolaire','edit'];
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
    private tarifsService: TarifsService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.tarifsService.getAll().subscribe({next:(response:any)=>{
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
    const dialogRef = this.dialog.open(TarifsDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddTarifs.subscribe((response) => {
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
    const dialogRef = this.dialog.open(TarifsDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditTarifs.subscribe((response) => {
      this.tableData();
    });
    }
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+values.code+' Tarifs',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteTarifs(values.id);
      dialogRef.close();
    });
    }

    deleteTarifs(id:any){
      this.tarifsService.delete(id).subscribe({next:(response:any)=>{
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
