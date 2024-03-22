import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReglementService {
  url = environment.apiUrl+"/api/reglement";
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

  getAllByEleveIdAndAnneScolaireId(eleveId:any,anneScolaireId:any){
    return this.http.get(this.url+'/getAllByEleveIdAndAnneScolaireId/'+eleveId+'/'+anneScolaireId);
  }

  getAllByEleveId(eleveId:any){
    return this.http.get(this.url+'/getAllByEleveId/'+eleveId);
  }
}
