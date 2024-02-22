import { Component } from '@angular/core';
import { NavigationStart, Router,Event as NavigationEvent, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrl: './school.component.scss'
})
export class SchoolComponent {
  event$: any;

  constructor(
private router:Router
  ){


  

    // this.event$
    //   =this.router.events
    //       .subscribe(
    //         (event: NavigationEvent) => {
    //           if(event instanceof NavigationStart) {
    //             console.log(event.url);
    //           }else if(event instanceof NavigationEnd){
    //             console.log(event);
    //           }
    //         });
  }

}
