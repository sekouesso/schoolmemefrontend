import { Component, ViewChild } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../../shared/global-constants';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { ReglementDialogComponent } from '../dialog/reglement-dialog/reglement-dialog.component';
import { NotificationDialogComponent } from '../dialog/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  displayColumns: string[]=['eleve','libelle','description','parent','date','edit'];
  dataSource:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.notificationService.getAll().subscribe({next:(response:any)=>{
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
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(NotificationDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddNotification.subscribe((response) => {
      this.tableData();
    });
    }

    handleEditAction(values:any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Edit',
        data:values
      };
      dialogConfig.width = '700px';
      const dialogRef = this.dialog.open(NotificationDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      const sub = dialogRef.componentInstance.onEditNotification.subscribe((response) => {
        this.tableData();
      });
      }

      handleDeleteAction(values: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          message:'delete '+values.numero+' Evaluation',
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
          this.notificationService.delete(id).subscribe({next:(response:any)=>{
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
