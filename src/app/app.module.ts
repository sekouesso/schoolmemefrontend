import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MaterialModule } from './shared/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { SchoolComponent } from './components/school/school.component';
import { CoefficientComponent } from './components/material-component/coefficient/coefficient.component';
import { EleveComponent } from './components/material-component/eleve/eleve.component';
import { EvaluationComponent } from './components/material-component/evaluation/evaluation.component';
import { MenuopenDirective } from './menuopen.directive';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from './shared/shared/shared.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';


// const ngxUiLoaderConfig: NgxUiLoaderConfig = {
//   text: "Loading...",
//   textColor: "white",
//   textPosition: "center-center",
//   pbColor: "white",
//   bgsColor: "white",
//   fgsColor: "white",
//   fgsType: SPINNER.ballScaleMultiple,
//   fgsSize:100,
//   pbDirection: PB_DIRECTION.leftToRight,
//   pbThickness: 10,
// };

const ngxUiLoaderConfig: NgxUiLoaderConfig ={
  text:"Loading...",
  textColor:"#FFFFFF",
  textPosition:"center-center",
  bgsColor:"7b1fa2",
  fgsColor:"7b1fa2",
  fgsType:SPINNER.circle,
  fgsSize:100,
  hasProgressBar:false,
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    SignupComponent,
    ForgotPasswordComponent,
    HomeComponent,
    SchoolComponent,
    CoefficientComponent,
    EleveComponent,
    EvaluationComponent,
    MenuopenDirective,
    ResetPasswordComponent,
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    QuillModule.forRoot(),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    SharedModule,
    DataTablesModule 
    
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe,
    HttpClientModule,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
