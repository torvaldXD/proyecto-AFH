import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/core/models/Employes';
import { User } from 'src/app/core/models/User';

@Injectable({
  providedIn: 'root'
})
export class EmployesService {

  constructor(public http: HttpClient) { }


  getAllEmployees():Observable<Employee>{
    return this.http.get<Employee>(`${environment.url}api/employees/findAllEmployees`);
  }

  createEmployees(employee:Employee):Observable<Employee>{
    return this.http.post<Employee>(`${environment.url}api/employees/createEmployee`, {
      employee
    });
  }

  findEmployeeById (idEmployeeFind:String){
    return this.http.get<Employee>(`${environment.url}api/employees/findEmployee/${idEmployeeFind}`);
  }

  updateEmployee(idEmployeeUpdate:String,employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(`${environment.url}api/employees/updateEmployee/${idEmployeeUpdate}`,{employee});
  }

  deleteEmployee(idEmployeeDelete:String):Observable<Employee>{
    return this.http.delete<Employee>(
      `${environment.url}api/employees/deleteEmployee/${idEmployeeDelete}`);
  }
  
  findByPage(desde?: number,limite?: number,filters?: any): Observable<Employee> {
    return this.http.get<Employee>(`${environment.url}api/employees/findByPageEmployees/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
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
