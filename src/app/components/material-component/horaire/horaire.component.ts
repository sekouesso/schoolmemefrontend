import { Component, ViewChild } from '@angular/core';
import { HoraireDialogComponent } from '../dialog/horaire-dialog/horaire-dialog.component';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { HoraireService } from '../../../services/horaire.service';

@Component({
  selector: 'app-horaire',
  templateUrl: './horaire.component.html',
  styleUrl: './horaire.component.scss'
})
export class HoraireComponent {
  displayColumns: string[]=['code','heure','edit'];
  dataSource:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private horaireService: HoraireService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.horaireService.getAll().subscribe({next:(response:any)=>{
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
    dialogConfig.width = '650px';
    const dialogRef = this.dialog.open(HoraireDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddHoraire.subscribe((response) => {
      this.tableData();
    });
    }

    handleEditAction(values:any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Edit',
        data:values
      };
      dialogConfig.width = '650px';
      const dialogRef = this.dialog.open(HoraireDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      const sub = dialogRef.componentInstance.onEditHoraire.subscribe((response) => {
        this.tableData();
      });
      }

      handleDeleteAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          message:'delete '+values.heure+' Heure',
          confirmation: true,
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent,dialogConfig);
        const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
          this.ngxService.start();
          this.deleteMatiere(values.id);
          dialogRef.close();
        });
        }
    
        deleteMatiere(id:any){
          this.horaireService.delete(id).subscribe({next:(response:any)=>{
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
