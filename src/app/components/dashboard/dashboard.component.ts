import { Component, ViewChild } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, NavigationStart, Router,Event as NavigationEvent } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EleveService } from '../../services/eleve.service';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationDialogComponent } from '../material-component/dialog/confirmation-dialog/confirmation-dialog.component';
import { EleveDialogComponent } from '../material-component/dialog/eleve-dialog/eleve-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  displayColumns: string[]=['matricule','nom','sexe','classe','edit'];
  dataSource:any;
  length:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  parentId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private eleveService: EleveService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    let p: any = localStorage.getItem('user')
    let parent:any = JSON.parse(p);
    this.parentId = parent.id;
    // console.log( parent);
    this.tableData();
  }

  tableData() {
    this.eleveService.findAllByParentId(this.parentId).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
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


  handleDetailsAction(eleve: any) {
    console.log(eleve);
    
    }
    handleNoteAction(eleve: any) {
    console.log(eleve);
    
    }
    handlePresenceAction(eleve: any) {
    console.log(eleve);
    
    }
    handleEmploiAction(eleve: any) {
    console.log(eleve);
    
    }
    handlePermissionAction(eleve: any) {
      console.log(eleve);
      
      }
    handleReglementAction(eleve: any) {
      console.log(eleve);
      
      }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add',
    };
    dialogConfig.width = '700px';
    const dialogRef = this.dialog.open(EleveDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddEleve.subscribe((response) => {
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
    const dialogRef = this.dialog.open(EleveDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditEleve.subscribe((response) => {
      this.tableData();
    });
    }
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+values.nom+' eleve',
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
      this.eleveService.delete(id).subscribe({next:(response:any)=>{
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
