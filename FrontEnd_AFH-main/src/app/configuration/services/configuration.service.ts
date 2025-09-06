import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(public http: HttpClient) { }

  findUserById (idUserFind:String){
    return this.http.get<User>(`${environment.url}api/users/findUser/${idUserFind}`);
  }


  updatePassword(id?: String, oldPassword?: string,newPassword?: string): Observable<User> {
    return this.http.put<User>(
      `${environment.url}api/users/updatePassword/` + id,
      { oldPassword,newPassword}
    );
  }

  updateUser(idUserUpdate:String,user:User):Observable<User>{
    return this.http.put<User>(
      `${environment.url}api/users/updateUser/${idUserUpdate}`,{user});
  }
}
