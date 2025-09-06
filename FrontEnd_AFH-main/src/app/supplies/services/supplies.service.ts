import { Injectable } from '@angular/core';
import { Supplies } from '../../core/models/Supplies';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {

  constructor(public http: HttpClient) { }


  createSupply(supply:Supplies):Observable<Supplies>{
    return this.http.post<Supplies>(`${environment.url}api/supplies/createSupply`, {
      supply
    });
  }

  getAllSupplies():Observable<Supplies>{
    return this.http.get<Supplies>(`${environment.url}api/supplies/getSupplies`,{});
  }

  updateSupply(idSupplyUpdate:String,supply:Supplies):Observable<Supplies>{
    return this.http.put<Supplies>(
      `${environment.url}api/supplies/updateSupply/${idSupplyUpdate}`,{supply});
  }

  deleteSupply(idSupplyDelete:String):Observable<Supplies>{
    return this.http.delete<Supplies>(
      `${environment.url}api/supplies/deleteSupply/${idSupplyDelete}`);
  }

  findSupplyById (idSupplyFind:String){
    return this.http.get<Supplies>(`${environment.url}api/supplies/findSupply/${idSupplyFind}`);
  }

  findByPage(desde?: number,limite?: number,filters?: any): Observable<Supplies> {
    return this.http.get<Supplies>(`${environment.url}api/supplies/findByPageSupplies/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }

}
