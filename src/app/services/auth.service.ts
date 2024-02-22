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
    window.localStorage.setItem('jwt-token', this.accessToken);
  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.username = undefined;
    this.roles = undefined;
    window.localStorage.removeItem("access-token");
    this.router.navigate(['/login']);
  }

  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem('jwt-token');
    if(token){
      this.loadProfile({"access-token":token});
      this.router.navigate(['/dashboard']);
    }
  }
}
