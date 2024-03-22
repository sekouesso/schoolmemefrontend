import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url = environment.apiUrl+"/api/notification";
  constructor(
    private http: HttpClient
  ) { }

  getNumero(ann:any) {
    return this.http.get(`${this.url}/getnumero/${ann}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  findAllByEleveId(eleveId:any) {
    return this.http.get(`${this.url}/findAllByEleveId/${eleveId}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  findAllByEleveIdAndCreatedAt(eleveId:any,createdAt:any) {
    return this.http.get(`${this.url}/findAllByEleveIdAndCreatedAt/${eleveId}/${createdAt}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  add(data:any){
    return this.http.post(this.url+'/add',data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  update(data:any){
    return this.http.put(this.url+'/update',data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  getAll(){
    return this.http.get(this.url+'/getAll');
  }

  delete(id:any){
    return this.http.delete(this.url+'/delete/'+id,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  getById(id:any){
    return this.http.get(this.url+'/getById/'+id);
  }
}
