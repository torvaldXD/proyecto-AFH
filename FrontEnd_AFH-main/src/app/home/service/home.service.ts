import { Injectable } from '@angular/core';
import { Supplies } from '../../core/models/Supplies';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Clients } from 'src/app/core/models/Clients';
import { Employee } from 'src/app/core/models/Employes';
import { Quotes } from 'src/app/core/models/Quotes';
import { User } from 'src/app/core/models/User';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(public http: HttpClient) { }

  getAllSupplies():Observable<Supplies>{
    return this.http.get<Supplies>(`${environment.url}api/supplies/getSupplies`,);
  }

  getAllClients():Observable<Clients>{
    return this.http.get<Clients>(`${environment.url}api/clients/findAllClients`);
  }

  getAllEmployees():Observable<Employee>{
    return this.http.get<Employee>(`${environment.url}api/employees/findAllEmployees`);
  }
  
  getAllQuotes():Observable<Quotes>{
    return this.http.get<Quotes>(`${environment.url}api/quotes/findAllQuotes`);
  }

  getAllTools():Observable<Quotes>{
    return this.http.get<Quotes>(`${environment.url}api/tools/findAllTools`);
  }
  getAllUsers():Observable<Quotes>{
    return this.http.post<Quotes>(`${environment.url}api/users/findAllUsers`,{});
  }

  getCurrentUser():any {
    const user_json = localStorage.getItem('userLogin');
    if (user_json) {
      const user: User = JSON.parse(user_json);
      return user;
    }
  }
  
  logOut(): void {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('userLogin');
    window.location.replace('/auth/login');
  }


  getImgUser(): any  {
    let myRute;
     if(localStorage.getItem('imgUser')===null){
      myRute= 'assets/user.jpg'
     }else{
      myRute = localStorage.getItem('imgUser');
     }

     return myRute;
  }

}
