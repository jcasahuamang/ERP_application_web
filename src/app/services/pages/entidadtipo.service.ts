import { EntidadTipo } from './../../models/pages/entidadtipo';
import swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuracion } from './../configuracion-global';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Pais } from 'src/app/models/pais';

@Injectable({
  providedIn: 'root'
})
export class EntidadtipoService {


  //  private urlEndPoint: string = 'http://localhost:8060/entidadTipo';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("EntidadTipo");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<EntidadTipo>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<EntidadTipo>(this.urlEndPoint);
  }

  getByEntidad(entidad: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+entidad.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  create(entidadTipo: EntidadTipo): Observable<EntidadTipo>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<EntidadTipo>(this.urlEndPoint,entidadTipo,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  update(entidadTipo: EntidadTipo): Observable<EntidadTipo>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+entidadTipo.id;
    return this.http.put<EntidadTipo>(this.urlEndPoint,entidadTipo,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(entidadTipo: Number): Observable<EntidadTipo>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+entidadTipo.toString();
    return this.http.delete<EntidadTipo>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }


  saveAll(entidadTipo: EntidadTipo[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/saveAll';

    return this.http.put<[]>(this.urlEndPoint,entidadTipo,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  deleteAll(entidadTipo: EntidadTipo[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/deleteAll';
      return this.http.put<[]>(this.urlEndPoint,entidadTipo,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }


}
