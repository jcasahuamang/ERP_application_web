import swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuracion } from './../configuracion-global';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TablaDet } from 'src/app/models/pages/tabladet';

@Injectable({
  providedIn: 'root'
})
export class TabladetService {

    //  private urlEndPoint: string = 'http://localhost:8060/tabladet';
    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root");
    private sistema: string = this.config.endPoints.get("TablaDet");

  //  private urlEndPoint: string = this.root+'/'+this.sistema;
    private urlEndPoint: string;
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})


  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<TablaDet>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<TablaDet>(this.urlEndPoint);
  }

  getByTabla(tabla: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+tabla.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }


  getByCompaniaTipo(compania: Number,tipo: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByTipo/'+compania.toString()+'/'+tipo;
    return this.http.get<[]>(this.urlEndPoint);
  }


  create(tabladet: TablaDet): Observable<TablaDet>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<TablaDet>(this.urlEndPoint,tabladet,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(tabladet: TablaDet): Observable<TablaDet>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+tabladet.id;
    return this.http.put<TablaDet>(this.urlEndPoint,tabladet,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(tabladet: Number): Observable<TablaDet>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+tabladet.toString();
    return this.http.delete<TablaDet>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  saveAll(tabladet: TablaDet[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/saveAll';

    return this.http.put<[]>(this.urlEndPoint,tabladet,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  deleteAll(tabladet: TablaDet[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/deleteAll';
      return this.http.put<[]>(this.urlEndPoint,tabladet,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
