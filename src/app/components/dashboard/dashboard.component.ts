import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { ClasseService } from '../../services/classe.service';
import { NiveauService } from '../../services/niveau.service';
import { DashboardService } from '../../services/dashboard.service';

import DataTable, { Config } from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import { DataTableDirective } from 'angular-datatables';

import $ from 'jquery';
import 'datatables.net'
import DataTables from 'datatables.net';
import { Subject } from 'rxjs';
import { EnseignantService } from '../../services/enseignant.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  displayColumns: string[]=['matricule','nom','sexe','classe','edit'];
  dataSource:any;
  eleves:any;
  notifForm!: FormGroup;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
 
  parentId: any;
  staticEconome: any;
  staticReglementEleves: any;
  listElevesAbsents: any;
  listElevesAbsentsPourEnseignant: any;
  staticCount: any;
  CountEleveByNiveau: any;
  CountEleveByClasse: any;
  classes: any;
  elevesDeuxiemeTranche: any;
  elevesNonDeuxiemeTranche: any;
  elevesNonPremierTranche: any;
  elevesNonTroisiemeTranche: any;
  elevesPremierTranche: any;
  elevesTroisiemeTranche: any;
  classeName!: string;
  isReglement: boolean=false;
  @ViewChild('exemple1') exemple1!: ElementRef;
  @ViewChild('buttonsContainer') buttonsContainer!: ElementRef;
  //dtOptions: Config = {};
  listClasseEnseignant: any;
  //dtOptions: DataTable.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  telephone: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private eleveService: EleveService,
    private enseignantService: EnseignantService,
    private notificationService: NotificationService,
    private classeService: ClasseService,
    private niveauService: NiveauService,
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    public authService: AuthService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    let p: any = window.localStorage.getItem('user');
    let parent:any = JSON.parse(p);
    this.parentId = parent.id;
    this.telephone = parent.telephone;

    this.notifForm = this.fb.group({
      eleveId:[null,[Validators.required]],
      createdAt:[null],
    });

    this.tableData();
    this.getStaticEconome();
    this.getStaticReglementEleves();
    this.getCount();
    this.getCountEleveByClasse();
    this.getCountEleveByNiveau();
    //this.getStaticAbsenceEleveHier();
    this.getClasseEnseignant(); 

    let table = new DataTables("#exemple1");
    console.log(table.$("#exemple").DataTable({
       "lengthChange": false, "autoWidth": false,
      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#example1_wrapper '));
    
    
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

  getClasses() {
    this.classeService.getAll().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.classes = response;
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

//****************************START PARENT*********************************** */
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
  //****************************END PARENT*********************************** */

  //****************************START ADMIN*********************************** */

  getCountEleveByClasse() {
    this.dashboardService.getCountEleveByClasse().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.CountEleveByClasse = response;
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

  getCountEleveByNiveau() {
    this.dashboardService.getCountEleveByNiveau().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.CountEleveByNiveau = response;
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

  getCount() {
    this.dashboardService.getCount().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.staticCount = response;
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

  //****************************END ADMIN*********************************** */

  //****************************START ECONOME*********************************** */
  getStaticEconome() {
    this.dashboardService.getStaticEconome().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.staticEconome = response;
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

  getStaticReglementEleves() {
    this.dashboardService.getStaticReglementEleves().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.staticReglementEleves = response;
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

  gotoEleve(index: number,className: string){
    let table = new DataTable('#myTable');
    const options:any = {
      lengthChange: false,
      autoWidth: false,
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis'],
    };

    options['responsive'] = true;
    $(document).ready(function () {
      $('#exemple1').DataTable(options).buttons().containers().appendTo('#example1wrapper .col-sm-3:eq(0)');
      
    });
    // $(document).ready(function () {
    //   $('#exemple1').DataTable({
    //    responsive: true,
    //     lengthChange: false,
    //     autoWidth: false,
    //     buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis']
    //   }).buttons().container().appendTo('#example1_wrapper .col-sm-3:eq(0)');
    // });

    this.isReglement = true;
    this.elevesDeuxiemeTranche = this.staticReglementEleves[index].elevesDeuxiemeTranche;
    this.elevesNonDeuxiemeTranche = this.staticReglementEleves[index].elevesNonDeuxiemeTranche;
    this. elevesNonPremierTranche = this.staticReglementEleves[index].elevesNonPremierTranche;
    this.elevesNonTroisiemeTranche = this.staticReglementEleves[index].elevesNonTroisiemeTranche;
    this.elevesPremierTranche = this.staticReglementEleves[index].elevesPremierTranche;
    this.elevesTroisiemeTranche = this.staticReglementEleves[index].elevesTroisiemeTranche;
    this.classeName = className;
  }

  //****************************END ECONOME*********************************** */

  //****************************START SURVEILLANT*********************************** */

  getStaticAbsenceEleveHier() {
    this.dashboardService.getStaticEleveHier().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.listElevesAbsents = response;
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

  //****************************END SURVEILLANT*********************************** */

  //****************************START ENSEIGNANT*********************************** */

  getClasseEnseignant() {
    this.enseignantService.findEnseignantByTelephone(this.telephone).subscribe({next:(data:any)=>{
      this.ngxService.stop();
      this.dashboardService.getClasseEnseignant(data.id).subscribe({next:(response:any)=>{
        this.ngxService.stop();
        this.listClasseEnseignant = response;
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


  getStaticEnseignantAbsenceEleveHier(classeId:any) {
    this.dashboardService.getStaticEnseignantAbsenceEleveHier(classeId).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.listElevesAbsentsPourEnseignant = response;
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

  //****************************END ENSEIGNANT*********************************** */
  fermer(){
    this.isReglement = false;
  }

  ngAfterViewInit() {
    let table = new DataTables("#exemple1");
    $(document).ready(function () {
      $('#exemple1').DataTable({
       // responsive: true,
        lengthChange: false,
        autoWidth: false,
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis']
      }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    });

  }
    


}
