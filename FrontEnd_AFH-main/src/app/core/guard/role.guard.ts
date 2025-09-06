import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageUserService } from '../services/storageuser.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGerenciaGuard implements CanActivate {

  constructor(private storageUser: StorageUserService,private router:Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.storageUser.getCurrentUser().area==="GERENCIA") {
        return true;
      } else {
        alert('No tienes permiso para ingresar a la ruta.');
        this.router.navigate(['/home']);
        return false;
      }
  }
  
}
