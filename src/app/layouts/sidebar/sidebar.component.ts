import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  router = inject(Router);

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
