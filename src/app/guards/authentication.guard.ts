import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  console.log("Authentication");
  
  if(authService.isAuthenticated==true || authService.isAuth()){
    console.log("authenticationGuard");
    console.log(authService.isAuthenticated,authService.isAuth());
    
    return true;
  }else {
    console.log(authService.isAuthenticated, authService.isAuth);
    console.log("!authenticationGuard");
    authService.logout();
    return false;
  }
};
