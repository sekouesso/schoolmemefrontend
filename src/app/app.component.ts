import { Component } from '@angular/core';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private snackbar:SnackbarService){}
test() {
this.snackbar.openSnackbar("hello some text","");
}
  title = 'memscolairefrontend';
}
