import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Tool } from 'src/app/core/models/Tool';
import { Files } from 'src/app/core/models/Files';
import { Codes } from 'src/app/core/models/Codes';
import { Employee } from 'src/app/core/models/Employes';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(public http: HttpClient) { }
  

  createTool(tool:Tool,):Observable<Tool>{
    const formData: FormData = new FormData();
    
    return this.http.post<Tool>(`${environment.url}api/tools/createTool`, {
      tool
    });
  }

  uploads(archivos?: Files, files?: File[]): Observable<Files>{
    const formData: FormData = new FormData();
    const length = files!.length;
    for (let i = 0; i < length; i++){
      const newLocal = 'name';
      // tslint:disable-next-line:no-non-null-assertion
      formData.append('archivos[]', files![i], files![i][newLocal]);
    }

    formData.append('titulo', archivos!.titulo);
    formData.append('idObjeto', archivos!.idObjeto);
    formData.append('dir', archivos!.dir);
    
    return this.http.post<Files>(`${environment.url}api/files/uploads`,formData);
  }

  updateUploads(archivos?: Files, files?: File[],pathAnterior?:string): Observable<Files>{
    const formData: FormData = new FormData();
    const length = files!.length;
    for (let i = 0; i < length; i++){
      const newLocal = 'name';
      // tslint:disable-next-line:no-non-null-assertion
      formData.append('archivos[]', files![i], files![i][newLocal]);
    }
    
    formData.append('pathAnterior',pathAnterior! );
    formData.append('titulo', archivos!.titulo);
    formData.append('idObjeto', archivos!.idObjeto);
    formData.append('dir', archivos!.dir);
    
    return this.http.post<Files>(`${environment.url}api/files/update`,formData);
  }

  deleteFilesTool(id: string, path: string): Observable<Files> {
    return this.http.delete<Files>(`${environment.url}api/files/delete/${id}/?path=${path}`);
  }

  getAllTools():Observable<Tool>{
    return this.http.get<Tool>(`${environment.url}api/tools/findAllTools`,{});
  }

  getAllCodes():Observable<Codes>{
    return this.http.get<Codes>(`${environment.url}api/tools/findAllCodes`,{});
  }

  updateTool(idToolUpdate:String,tool:Tool):Observable<Tool>{
    return this.http.put<Tool>(
      `${environment.url}api/tools/updateTool/${idToolUpdate}`,{tool});
  }

  deleteTool(idToolDelete:String):Observable<Tool>{
    return this.http.delete<Tool>(
      `${environment.url}api/tools/deleteTool/${idToolDelete}`);
  }

  findToolById (idToolFind:String){
    return this.http.get<Tool>(`${environment.url}api/tools/findTool/${idToolFind}`);
  }

  findByAutoComplete(filter?: any): Observable<Employee> {
    return this.http.get<Employee>(`${environment.url}api/employees/findByAutoComplete/?filters=${filter}`);
  }

  findByPage(desde?: number,limite?: number,filters?: any): Observable<Tool> {
    return this.http.get<Tool>(`${environment.url}api/tools/findByPageTools/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
        filters
      )}`
    );
  }

}
