import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EleveService } from '../../../../services/eleve.service';
import { NotificationService } from '../../../../services/notification.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { GlobalConstants } from '../../../../shared/global-constants';

@Component({
  selector: 'app-permission-eleve-dialog',
  templateUrl: './permission-eleve-dialog.component.html',
  styleUrl: './permission-eleve-dialog.component.scss'
})
export class PermissionEleveDialogComponent {

  
  displayColumns: string[]=['libelle','date','description'];
  dataSource:any;
  eleves:any;
  notifForm!: FormGroup;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  parentId: any;
  eleve: any;
  dialogAction: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private eleveService: EleveService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    
    this.eleve = this.dialogData.data.eleve;
    this.eleves = this.dialogData.data.eleves;
    this.dialogAction = this.dialogData.action;
    this.tableDataNotifiaction(this.eleve.id);
    this.notifForm = this.fb.group({
      eleveId:[null,[Validators.required]],
      createdAt:[null],
    });

  }

 

  handleSubmit(){
    console.log(this.notifForm.value);
    if(this.notifForm.value.createdAt===null){
      this.tableDataNotifiaction(this.notifForm.value.eleveId);
    }else{
      this.tableDataNotifiactionDate(this.notifForm.value.eleveId, this.notifForm.value.createdAt);
    }
    
  }

  tableDataNotifiaction(eleveId:any) {
    this.notificationService.findAllByEleveId(eleveId).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort;
      
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

  tableDataNotifiactionDate(eleveId:any,createdAt:any) {
    this.notificationService.findAllByEleveIdAndCreatedAt(eleveId,createdAt).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort;
      
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




}
