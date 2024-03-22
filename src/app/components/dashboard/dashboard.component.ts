import { Component, ViewChild } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, NavigationStart, Router,Event as NavigationEvent } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EleveService } from '../../services/eleve.service';
import { GlobalConstants } from '../../shared/global-constants';
import { NotificationDialogComponent } from '../material-component/dialog/notification-dialog/notification-dialog.component';
import { EmlpoiEleveDialogComponent } from '../material-component/dialog/emlpoi-eleve-dialog/emlpoi-eleve-dialog.component';
import { NoteEleveDialogComponent } from '../material-component/dialog/note-eleve-dialog/note-eleve-dialog.component';
import { ReglementEleveDialogComponent } from '../material-component/dialog/reglement-eleve-dialog/reglement-eleve-dialog.component';
import { AbsenceEleveDialogComponent } from '../material-component/dialog/absence-eleve-dialog/absence-eleve-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { PermissionEleveDialogComponent } from '../material-component/dialog/permission-eleve-dialog/permission-eleve-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  displayColumns: string[]=['matricule','nom','sexe','classe','edit'];
  dataSource:any;
  // displayColumnsNotification: string[]=['matricule','nom','libelle','date','description'];
  // dataSourceNotification:any;
  eleves:any;
  notifForm!: FormGroup;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  parentId: any;

  // @ViewChild(MatPaginator) paginatornotif !: MatPaginator;
  // @ViewChild(MatSort) sortnotif !: MatSort;

  constructor(
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
    let p: any = localStorage.getItem('user')
    let parent:any = JSON.parse(p);
    this.parentId = parent.id;
    this.eleves = parent.eleves;
    console.log(this.eleves);
    
    console.log(this.eleves[0].id);
    
    // this.tableDataNotifiaction(this.eleves[0].id);
    this.notifForm = this.fb.group({
      eleveId:[null,[Validators.required]],
      createdAt:[null],
    });

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

  // handleSubmit(){
  //   console.log(this.notifForm.value);
  //   if(this.notifForm.value.createdAt===null){
  //     this.tableDataNotifiaction(this.notifForm.value.eleveId);
  //   }else{
  //     this.tableDataNotifiactionDate(this.notifForm.value.eleveId, this.notifForm.value.createdAt);
  //   }
    
  // }

  // tableDataNotifiaction(eleveId:any) {
  //   this.notificationService.findAllByEleveId(eleveId).subscribe({next:(response:any)=>{
  //     this.ngxService.stop();
  //     this.dataSourceNotification = new MatTableDataSource(response);
  //     this.dataSourceNotification.paginator=this.paginator;
  //     this.dataSourceNotification.sort = this.sort;
      
  //   },
  //   error:(error:any)=>{
  //     this.ngxService.stop();
  //     console.log(error.error?.message);
  //     if(error.error?.message){
  //       this.responseMessage = error.error?.message;
  //     }else {
  //       this.responseMessage = GlobalConstants.generisError;
  //     }
  //     this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //   }
  // });
  // }

  // tableDataNotifiactionDate(eleveId:any,createdAt:any) {
  //   this.notificationService.findAllByEleveIdAndCreatedAt(eleveId,createdAt).subscribe({next:(response:any)=>{
  //     this.ngxService.stop();
  //     this.dataSourceNotification = new MatTableDataSource(response);
  //     this.dataSourceNotification.paginator=this.paginator;
  //     this.dataSourceNotification.sort = this.sort;
      
  //   },
  //   error:(error:any)=>{
  //     this.ngxService.stop();
  //     console.log(error.error?.message);
  //     if(error.error?.message){
  //       this.responseMessage = error.error?.message;
  //     }else {
  //       this.responseMessage = GlobalConstants.generisError;
  //     }
  //     this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //   }
  // });
  // }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // applyFilterNotifation(event:Event){
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSourceNotification.filter = filterValue.trim().toLowerCase();
  // }


  handleDetailsAction(eleve: any) {
    console.log(eleve);
    
    }
    handleNoteAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Les notes de '+values.nom+' '+values.prenom,
        data: values
      };
      dialogConfig.width = '700px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(NoteEleveDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
    
    }
    handlePresenceAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'La Présence de '+values.nom+' '+values.prenom,
        data: values
      };
      dialogConfig.width = '750px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(AbsenceEleveDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
    
    }
    handleEmploiAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Emploi du temps de'+values.nom+' '+values.prenom,
        data:values
      };
      dialogConfig.width = '700px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(EmlpoiEleveDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      // const sub = dialogRef.componentInstance.onAddNotification.subscribe((response) => {
      //   this.tableData();
      // });
    
    }

    handlePermissionViewAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Les notifications consernant '+values.nom+' '+values.prenom,
        data: {
          eleve: values,
          eleves: this.eleves
        }
      };
      dialogConfig.width = '750px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(PermissionEleveDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      }

    handlePermissionAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Add',
        data: values
      };
      dialogConfig.width = '700px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(NotificationDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      // const sub = dialogRef.componentInstance.onAddNotification.subscribe((response) => {
      //   this.tableDataNotifiaction(values.id);
      // });
      
      }
    handleReglementAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Les règlements de '+values.nom+' '+values.prenom,
        data: values
      };
      dialogConfig.width = '700px';
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(ReglementEleveDialogComponent,dialogConfig);
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
      
      }


}
