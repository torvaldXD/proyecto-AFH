import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bills } from 'src/app/core/models/Bills';
import { Employee } from 'src/app/core/models/Employes';
import { HistoryInventory } from 'src/app/core/models/HistoryInventory';
import { Supplies } from 'src/app/core/models/Supplies';
import { Tool } from 'src/app/core/models/Tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(public http: HttpClient) { }



  findByAutoCompleteSupply(filter?: any): Observable<Tool> {
    return this.http.get<Tool>(`${environment.url}api/tools/findByAutoComplete/?filters=${filter}`);
  }

  findByAutoCompleteTool(filter?: any): Observable<Supplies> {
    return this.http.get<Supplies>(`${environment.url}api/supplies/findByAutoComplete/?filters=${filter}`);
  }

  findByAutoCompleteEmployee(filter?: any): Observable<Employee> {
    return this.http.get<Employee>(`${environment.url}api/employees/findByAutoComplete/?filters=${filter}`);
  }

  findByAutoCompleteBill(filter?: any): Observable<Bills> {
    return this.http.get<Bills>(`${environment.url}api/bills/findByAutoComplete/?filters=${filter}`);
  }

  deleteHistory(idHistoryDelete:String):Observable<HistoryInventory>{
    return this.http.delete<HistoryInventory>(
      `${environment.url}api/historyinventory/deleteHistory/${idHistoryDelete}`);
  }

  deleteBills(idBillDelete:String):Observable<Bills>{
    return this.http.delete<Bills>(
      `${environment.url}api/bills/deleteBills/${idBillDelete}`);
  }

  createBills(bill:Bills):Observable<Bills>{
    return this.http.post<Bills>(`${environment.url}api/bills/createBill`, {
      bill
    });
  }
  createHistory(history:HistoryInventory):Observable<HistoryInventory>{
    return this.http.post<HistoryInventory>(`${environment.url}api/historyinventory/createHistory`, {
      history
    });
  }

  updateTool(idToolUpdate:String,tool:Tool):Observable<Tool>{
    return this.http.put<Tool>(
      `${environment.url}api/tools/updateToolByHistory/${idToolUpdate}`,{tool});
  }

  updateSupply(idSupplyUpdate:String,supply:Supplies):Observable<Supplies>{
    return this.http.put<Supplies>(
      `${environment.url}api/supplies/updateSupply/${idSupplyUpdate}`,{supply});
  }

  getAllHistories():Observable<HistoryInventory>{
    return this.http.get<HistoryInventory>(`${environment.url}api/historyinventory/findAllHistories`,{});
  }

  getAllBills():Observable<Bills>{
    return this.http.get<Bills>(`${environment.url}api/bills/findAllBills`,{});
  }

  findByPageBills(desde?: number,limite?: number,filters?: any,): Observable<Bills> {
    return this.http.get<Bills>(`${environment.url}api/bills/findByPageBills/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }
  findByPage(desde?: number,limite?: number,filters?: any,): Observable<HistoryInventory> {
    return this.http.get<HistoryInventory>(`${environment.url}api/historyinventory/findByPageHistory/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }
}
