import { Component, ViewChild } from '@angular/core';
import { NoteDialogComponent } from '../dialog/note-dialog/note-dialog.component';
import { NoteService } from '../../../services/note.service';
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

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  displayColumns: string[]=['numero','annee','anneScolaire','classe','edit'];
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
    private noteService: NoteService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.noteService.getAll().subscribe({next:(response:any)=>{
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

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add',
    };
    dialogConfig.width = '700px';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(NoteDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddNote.subscribe((response) => {
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
    const dialogRef = this.dialog.open(NoteDialogComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditNote.subscribe((response) => {
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
      this.noteService.delete(id).subscribe({next:(response:any)=>{
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
