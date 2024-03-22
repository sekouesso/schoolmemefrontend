import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl+"/utilisateur";
  constructor(
    private httpClient:HttpClient
  ) { }

  signup(data:any){
    return this.httpClient.post(this.url+"/register",data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }

  forgotPassword(data:any){
    return this.httpClient.post(this.url+"/forgotPassword",data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }

  resetPassword(data:any){
    return this.httpClient.put(`${this.url}/resetPassword`,data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }

  login(data:any){
    return this.httpClient.post(this.url+"/login",data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }

 

  changePassword(data:any){
    return this.httpClient.post(this.url+"/changePassword",data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }

  getUsers(){
    return this.httpClient.get(this.url+"/getAll")
  }

  updatestatus(id:any){
    return this.httpClient.patch(this.url+"/updatestatus/"+id,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    })
  }
}
