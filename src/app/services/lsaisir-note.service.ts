import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LsaisirNoteService {

  url = environment.apiUrl+"/api/lsaisirnote";
  constructor(
    private http: HttpClient
  ) { }

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

  getAllByNumero(numero:any){
    return this.http.get(this.url+'/getAllByNumero/'+numero);
  }

  getAllNoteByEleve(eleveId:any){
    return this.http.get(this.url+'/getAllNoteByEleve/'+eleveId);
  }

  getNoteEleve(eleveId:any){
    return this.http.get(this.url+'/getNoteEleve/'+eleveId);
  }

}
