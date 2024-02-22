import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarifsService {
  url = environment.apiUrl+"/api/tarifs";
  public formData !: FormGroup;
  constructor(
    private httpClient:HttpClient
  ) { }


  getData(id: string) {
    return this.httpClient.get(`${this.url}/getById/${id}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  getTarif(annee : number) {
    return this.httpClient.get(`${this.url}/getByAnne/${annee}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }
  getNumero() {
    return this.httpClient.get(`${this.url}/getcode`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  add(data: any){
    return this.httpClient.post(`${this.url}/add`, data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  update(data: any): Observable<Object> {
    return this.httpClient.put(`${this.url}/update`, data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/delete/${id}`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }

  getAll(){
    return this.httpClient.get(`${this.url}/getAll`,{
      headers:new HttpHeaders().set("Content-Type","Application/json")
    });
  }
}
