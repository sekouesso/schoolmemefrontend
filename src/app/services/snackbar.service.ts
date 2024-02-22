import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar:MatSnackBar
  ) { }
  openSnackbar(message:string,action:string){
    if(action==='error'){
      this.snackbar.open(message,'',{
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration:5000,
        panelClass:['app-notification-error']
      });
    }else{
      this.snackbar.open(message,'',{
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration:5000,
        panelClass:['app-notification-success']
      });
    }
  }


}
