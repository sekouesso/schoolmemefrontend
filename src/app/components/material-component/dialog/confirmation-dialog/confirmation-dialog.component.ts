import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  onEmitStatusChange = new EventEmitter();
details:any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any
  ){}

  ngOnInit(): void {
    if(this.dialogData && this.dialogData.confirmation){
      this.details = this.dialogData;
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }


}
