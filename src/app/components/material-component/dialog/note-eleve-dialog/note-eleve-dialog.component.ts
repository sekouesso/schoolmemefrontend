import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EmploiService } from '../../../../services/emploi.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { LnoteService } from '../../../../services/lnote.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../../../shared/global-constants';

@Component({
  selector: 'app-note-eleve-dialog',
  templateUrl: './note-eleve-dialog.component.html',
  styleUrl: './note-eleve-dialog.component.scss'
})
export class NoteEleveDialogComponent {

  displayColumns: string[]=['nom','matiere','note'];
  dataSource:any;
  length:any;
  responseMessage:any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  classeId: any;
  anneScolaireId: any;
  emploi: any;
  dialogInfos: any;
  eleveId: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private lnoteService: LnoteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    console.log(this.dialogData.data);
    this.dialogInfos = this.dialogData.action;
    console.log(this.dialogInfos);
    this.eleveId = this.dialogData.data.id;
    
    this.tableData();
  }

  tableData() {
    this.lnoteService.getNoteEleve(this.eleveId).subscribe({next:(response:any)=>{
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
