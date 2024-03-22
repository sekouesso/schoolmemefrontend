import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  roles!:any;
  username!: any ;
  accessToken!:any;
  baseUrl = environment.apiUrl + "/utilisateur"

  constructor(private http:HttpClient,private router:Router) { }

  public login(data:any){
    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
      return this.http.post(`${this.baseUrl}/login`, data, options)
  }
  public profile(){
      return this.http.get(`${this.baseUrl}/profile`)
  }

 

  loadProfile(data: any){
    this.isAuthenticated = true;
    this.accessToken = data['access-token'];
    let decodeJwt:any = jwtDecode(this.accessToken);
    this.username = decodeJwt.sub;
    this.roles = decodeJwt.scope;
    window.localStorage.setItem('token', this.accessToken);
  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.username = undefined;
    this.roles = undefined;
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    this.router.navigate(['/']);
  }

  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem('token');
    if(token){
      this.loadProfile({"access-token":token});
      this.findByEmail();
      this.router.navigate(['/school/dashboard']);
    }
  }

  public isAuth():boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return false;
    }else{
      return true;
    }
  }

  public findByEmail(){
    return this.http.get(`${this.baseUrl}/findByEmail/${this.username}`)
}

public isAdmin(){
    if (this.roles && this.roles==="ROLE_ADMIN") {
      return true;
    }else{
      return false;
    }
}

public isSurveillant(){
  if (this.roles && this.roles==="ROLE_SURVEILLANT") {
    return true;
  }else{
    return false;
  }
}

public isParent(){
  if (this.roles && this.roles==="ROLE_PARENT") {
    return true;
  }else{
    return false;
  }
}

public isEconome(){
  if (this.roles && this.roles==="ROLE_ECONOME") {
    return true;
  }else{
    return false;
  }
}

public isEnseignant(){
  if (this.roles && this.roles==="ROLE_ENSEIGNANT") {
    return true;
  }else{
    return false;
  }
}



}
