import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SchoolComponent } from './components/school/school.component';

const routes: Routes = [
  { path :"", component : HomeComponent},
  { path :"", redirectTo :"/home", pathMatch :'full'},
  { path :"login", component : LoginComponent},
  {path: "school", component: SchoolComponent,
  children: [
    {
      path: '',
      loadChildren:
        () => import('./components/material-component/material-component.module').then(m => m.MaterialComponentModule)
    },
  ]
},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
