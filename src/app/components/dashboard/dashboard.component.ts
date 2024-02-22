import { Component } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { ActivatedRoute, NavigationStart, Router,Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  event$: any;
  
  constructor(
    private snackbar:SnackbarService,
    private acroute:ActivatedRoute,
    private route: Router
    ){
    console.log(route.url);
    console.log(route.url.includes("/dashboard/matiere"));
    console.log("Baleine bleue".includes("baleine"));

    // this.event$
    //   =this.route.events
    //       .subscribe(
    //         (event: NavigationEvent) => {
    //           if(event instanceof NavigationStart) {
    //             console.log(event.url);
    //           }else{
    //             console.log(event);
    //           }
    //         });
    
    
  }
  test() {
  this.snackbar.openSnackbar("hello some text","");
  }
    title = 'memscolairefrontend';
}
