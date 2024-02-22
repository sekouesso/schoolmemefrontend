import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  url = environment.apiUrl+"/api/eleve";
  constructor(
    private http: HttpClient
  ) { }

  getNumero(ann:any) {
    return this.http.get(`${this.url}/getnumero/${ann}`,{
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

  getByMatricule(matricule:any){
    return this.http.get(this.url+'/getById/'+matricule);
  }

  getAllByClasseCode(code:any){
    return this.http.get(this.url+'/getByCode/'+code);
  }

  getAllByClasseId(classeId:any){
    return this.http.get(this.url+'/getByClasseId/'+classeId);
  }
  
}
