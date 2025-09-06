import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clients } from 'src/app/core/models/Clients';
import { Codes } from 'src/app/core/models/Codes';
import { Files } from 'src/app/core/models/Files';
import { FilesPDF, Quotes } from 'src/app/core/models/Quotes';
import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(public http: HttpClient) { }


  getAllQuotes():Observable<Quotes>{
    return this.http.get<Quotes>(`${environment.url}api/quotes/findAllQuotes`);
  }

  createQuotes(quotes:Quotes):Observable<Quotes>{
    return this.http.post<Quotes>(`${environment.url}api/quotes/createQuote`, {
      quotes
    });
  }
  
  createFilePDF(quotes:Quotes):Observable<Files>{
    return this.http.post<Files>(`${environment.url}api/files/createPdfQuotes`, {
      quotes
    });
  }

  updateFilePDF(quotes:Quotes):Observable<Files>{
    return this.http.post<Files>(`${environment.url}api/files/updatePdfQuotes`, {
      quotes
    });
  }
  downloadFilePDF(path:string){
    return this.http.post(`${environment.url}api/files/download/`,{ path }, { responseType: 'blob'});
  }

  findQuotesById (idQuoteFind:String){
    return this.http.get<Quotes>(`${environment.url}api/quotes/findQuote/${idQuoteFind}`);
  }

  updateQuotes(idQuoteUpdate:String,quotes:Quotes):Observable<Quotes>{
    return this.http.put<Quotes>(`${environment.url}api/quotes/updateQuote/${idQuoteUpdate}`,{quotes});
  }

  findByAutoComplete(filter?: any): Observable<Clients> {
    return this.http.get<Clients>(`${environment.url}api/clients/findByAutoComplete/?filters=${filter}`);
  }

  getAllCodesQuotes():Observable<Codes>{
    return this.http.get<Codes>(`${environment.url}api/quotes/findAllCodes`,{});
  }

  deleteQuote(idQuoteDelete:String):Observable<Quotes>{
    return this.http.delete<Quotes>(
      `${environment.url}api/quotes/deleteQuote/${idQuoteDelete}`);
  }

  deleteFilesQuote(id: string, quote: Quotes): Observable<Files> {
    
    return this.http.post<Files>(`${environment.url}api/files/deleteQuote/`,{quote});
  }

  deleteOneFilePdf(id: string, path: string): Observable<Files> {
    return this.http.delete<Files>(`${environment.url}api/files/deleteOneFile/${id}/?path=${path}`);
  }

  findByPage(desde?: number,limite?: number,filters?: any): Observable<Quotes> {
    return this.http.get<Quotes>(`${environment.url}api/quotes/findByPageQuotes/?desde=${desde}&limite=${limite}&filters=${JSON.stringify(
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
