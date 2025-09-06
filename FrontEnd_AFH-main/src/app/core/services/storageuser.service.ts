import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class StorageUserService {

  constructor() { }


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

  logOut(): void {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('userLogin');
    window.location.replace('/auth/login');
  }
}
