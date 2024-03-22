import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);
  // if(authService.roles.includes("ADMIN")){
  //   return true;
  // }else {
  //   authService.logout();
  //   return false;
  // }
  console.log("authorizationGuard");
  let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray['expectedRole'];

    const token:any = localStorage.getItem('token');

    var  tokenPayload:any;
    try {
      tokenPayload = jwtDecode(token);
      console.log(tokenPayload);
      console.log(expectedRoleArray);
      
      
    } catch (error) {
      console.log("logout", error);
      
      authService.logout();
    }
    let expectedRole = '';
    for(let i=0; i<expectedRoleArray['length']; i++) {
      if(expectedRoleArray[i] ==tokenPayload.scope){
        expectedRole = tokenPayload.scope;
        
      }
    }

  //   if(expectedRoleArray['includes'](authService.roles)){
  //     console.log("loging role");
  //   return true;
  // }else {
  //   console.log("loging role");
    
  //   authService.logout();
  //   return false;
  // }
    if(tokenPayload.scope == 'ROLE_ECONOME' ||
      tokenPayload.scope == 'ROLE_SURVEILLANT' ||
      tokenPayload.scope == 'ROLE_ADMIN' ||
      tokenPayload.scope == 'ROLE_PARENT' || 
      tokenPayload.scope == 'ROLE_ENSEIGNANT' || expectedRoleArray['includes'](authService.roles) ){
      if(authService.isAuthenticated || authService.isAuth()) {
        return true;
      }
      console.log("authService.isAuthenticated");
      
      snackbarService.openSnackbar(GlobalConstants.unauthorized,GlobalConstants.error);
      authService.logout();
      return false;
    }else{
      console.log("authService.isAuthenticated else false");
      authService.logout();
      return false;
    }


};
