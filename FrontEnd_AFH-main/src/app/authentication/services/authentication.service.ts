import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../core/models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(public http: HttpClient) {}

  signIn(email: string, password: string):Observable<User> {
    return this.http.post<User>(`${environment.url}api/users/login`, {
      email,
      password,
    });
  }

  recoverPassword(email: string): Observable<User> {
    return this.http.get<User>(`${environment.url}api/users/recoverPassword/${email}`);
  }

  signUp(name:String,email:String,phoneNumber:String,password:String){
    return this.http.post(`${environment.url}api/users/createUser`, {
      name,
      email,
      phoneNumber,
      password,
    });
  }
  
  getAllUsers():Observable<User>{
    return this.http.post<User>(`${environment.url}api/users/findAllUsers`,{});
  }


  saveUserStorage(user: User): void {
    const user_json = JSON.stringify(user);
    localStorage.setItem('userLogin', user_json);
  }

  setTokenUser(token: any): void {
    localStorage.setItem('tokenUser', token);
  }


  getTokenUser(): any {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): any {
    const user_json = localStorage.getItem('userLogin');
    if (user_json) {
      const user: User = JSON.parse(user_json);
      return user;
    }
  }


}
