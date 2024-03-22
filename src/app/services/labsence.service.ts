import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LabsenceService {
  url = environment.apiUrl+"/api/labsence";
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

  getAbsenceEleve(eleveId:any){
    return this.http.get(this.url+'/getAbsenceEleve/'+eleveId);
  }

  getAllByNumero(numero:any){
    return this.http.get(this.url+'/getAllByNumero/'+numero);
  }

  getAllEleveAbsentCours(numero:any){
    return this.http.get(this.url+'/getAllByNumeroStatutFalse/'+numero);
  }
  
  findAllByEleveAndDate(eleveId:any, date1:any, date2:any){
    return this.http.get(this.url+'/findAllByEleveAndDate/'+eleveId+'/'+date1+'/'+date2);
  }
}
