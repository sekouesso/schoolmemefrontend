import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   if(!req.url.includes("/utilisateur/login")){
//     let newreq= req.clone({
//       headers:  req.headers.set('Authorization','Bearer '+authService.accessToken)
//     });
//     return next(newreq).pipe(
//       catchError(error=>{
//         if(error.status ==401){
//           authService.logout();
//         }
//         return throwError(error.message)
//       })
//     );
//   }else 
//   return next(req);
// };

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = inject(AuthService);
    const snackbarService = inject(SnackbarService);
    const router = inject(Router);
      if(!req.url.includes("/utilisateur/login")){
        if(req.url.includes("/utilisateur/register") || req.url.includes("/utilisateur/forgotPassword")|| req.url.includes("/utilisateur/resetPassword")){
          return next.handle(req);
        }
        let token = localStorage.getItem("token");
        let newreq= req.clone({
          headers:  req.headers.set('Authorization','Bearer '+token)
        });
        //console.log(newreq);
        
        return next.handle(newreq).pipe(
          catchError(error=>{
            //console.log(error.status);
            
            if(error.status ==401 || error.status === 403){
              snackbarService.openSnackbar("Please Login to continue",GlobalConstants.error);
              authService.logout();
             // router.navigateByUrl('/');
            }
            return throwError(error.message)
          })
        );
      }else {
          //console.log(req)
        return next.handle(req);
      }
     
  }

}