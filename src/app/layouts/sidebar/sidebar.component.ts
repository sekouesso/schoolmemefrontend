import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  router = inject(Router);
  public authService = inject(AuthService);
  currentUser:any;
  
  ngOnInit() {
    // this.authService.findByEmail().subscribe({
    //   next: (response)=>{
    //     this.currentUser=response;
    //   },
    //   error: (error)=>{
    //     console.log(error.error?.message);
        
    //   }
    // })
    
  }

  currentAction :any;
  menu: any;
  activeElement: any;

  setCurrentAction(action: any) {
    this.currentAction = action;
  }

  setMenuClass(route:string, classe:string) {
    let currentRoute = this.router.url;
    if (currentRoute.includes(route)) {
      return classe;
    }
    return "";
  }

  setMenuActive(route:string) {
    let currentRoute = this.router.url;
    if (currentRoute===route) {
      return "active";
    }
    return "";
  }

  open(route:string) {
    if (route) {
      this.menu = "";
    }else{
      this.menu = route;
    }
  }

  addClass(elementId: string) {
    this.activeElement = elementId;
  }





}
