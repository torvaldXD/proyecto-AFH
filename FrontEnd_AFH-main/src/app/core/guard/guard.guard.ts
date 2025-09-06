 import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageUserService } from '../services/storageuser.service';

@Injectable({
  providedIn: 'root'
})
export class Guard implements CanActivate {

  constructor (private storageUser: StorageUserService,private router:Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.storageUser.getCurrentUser()) {
        // login TRUE
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    

    // return true;
  }
  
}
