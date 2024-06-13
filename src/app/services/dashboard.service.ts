import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.apiUrl+"/api/dashboard";
  constructor(
    private http: HttpClient
  ) { }
  getCount(){
    return this.http.get(this.url+'/getCount',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getCountEleveByClasse(){
    return this.http.get(this.url+'/getCountEleveByClasse',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getCountEleveByNiveau(){
    return this.http.get(this.url+'/getCountEleveByNiveau',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getStaticEconome(){
    return this.http.get(this.url+'/getStaticEconome',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getStaticReglementEleves(){
    return this.http.get(this.url+'/getStaticReglementEleves',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getStaticEleveHier(){
    return this.http.get(this.url+'/getStaticEleveHier',{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getStaticEnseignantAbsenceEleveHier(classeId:any){
    return this.http.get(this.url+'/getStaticEnseignantEleveHier/'+classeId,{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getClasseEnseignant(enseignantId:any){
    return this.http.get(this.url+'/getClasseEnseignant/'+enseignantId,{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
  getStaticAbsenceEleveBetweenDate1AndDate2(date1:any,date2:any){
    return this.http.get(this.url+'/getStaticAbsenceEleveBetweenDate1AndDate2/'+date1+'/'+date2,{headers:new HttpHeaders().set("Content-Type","Application/json")});
  }
}
