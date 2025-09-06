import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceStaffService {

  constructor(public http: HttpClient) { }

  // CRUD
  createUser(user:User):Observable<User>{
    return this.http.post<User>(`${environment.url}api/users/createUser`, {
      user
    });
  }

  updateUser(idUserUpdate:String,user:User):Observable<User>{
    return this.http.put<User>(
      `${environment.url}api/users/updateUser/${idUserUpdate}`,{user});
  }

  deleteUser(idUserDelete:String):Observable<User>{
    return this.http.delete<User>(
      `${environment.url}api/users/deleteUser/${idUserDelete}`);
  }
  
  findUserById (idUserFind:String){
    return this.http.get<User>(`${environment.url}api/users/findUser/${idUserFind}`);
  }

  findByPage(desde?: number,limite?: number,filters?: any): Observable<User> {
    return this.http.get<User>(`${environment.url}api/users/findByPageUsers/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }


  

  
}
