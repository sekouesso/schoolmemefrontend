import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SchoolComponent } from './components/school/school.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authorizationGuard } from './guards/authorization.guard';
import { authenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  { path :"", component : HomeComponent},
  { path :"", redirectTo :"/home", pathMatch :'full'},
  { path :"login", component : LoginComponent},
  { path :"reset-password/:email", component : ResetPasswordComponent},
  {path: "school", component: SchoolComponent,canActivate:[authenticationGuard],
  children: [
    {
      path: '',
      loadChildren:
        () => import('./components/material-component/material-component.module').then(m => m.MaterialComponentModule),
        canActivate: [authorizationGuard],
          data:{
            expectedRole: ['ROLE_ENSEIGNANT','ROLE_ADMIN','ROLE_ECONOME','ROLE_SURVEILLANT','ROLE_PARENT'],
          }
    },
  ]
},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
