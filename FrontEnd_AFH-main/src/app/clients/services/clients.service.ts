import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clients } from 'src/app/core/models/Clients';
import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(public http: HttpClient) { }


  getAllClients():Observable<Clients>{
    return this.http.get<Clients>(`${environment.url}api/clients/findAllClients`);
  }

  createClient(client:Clients):Observable<Clients>{
    return this.http.post<Clients>(`${environment.url}api/clients/createClient`, {
      client
    });
  }

  findClientById (idClientFind:String){
    return this.http.get<Clients>(`${environment.url}api/clients/findClient/${idClientFind}`);
  }

  updateClient(idClientUpdate:String,client:Clients):Observable<Clients>{
    return this.http.put<Clients>(`${environment.url}api/clients/updateClient/${idClientUpdate}`,{client});
  }

  deleteClient(idClientDelete:String):Observable<Clients>{
    return this.http.delete<Clients>(
      `${environment.url}api/clients/deleteClient/${idClientDelete}`);
  }
  
  findByPage(desde?: number,limite?: number,filters?: any): Observable<Clients> {
    return this.http.get<Clients>(`${environment.url}api/clients/findByPageClients/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }

  //User configuration
  getImgUser(): any  {
    let myRute;
     if(localStorage.getItem('imgUser')===null){
      myRute= 'assets/user.jpg'
     }else{
      myRute = localStorage.getItem('imgUser');
     }
     return myRute;
  }

  getCurrentUser():any {
    const user_json = localStorage.getItem('userLogin');
    if (user_json) {
      const user: User = JSON.parse(user_json);
      return user;
    }
  }
}
