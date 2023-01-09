import { EntidadContacto } from './../../models/pages/entidadcontacto';
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
export class EntidadcontactoService {


  //  private urlEndPoint: string = 'http://localhost:8060/entidadContacto';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("EntidadContacto");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<EntidadContacto>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<EntidadContacto>(this.urlEndPoint);
  }

  getByEntidad(entidad: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+entidad.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByEntidadNombre(entidad: Number,nombre: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByNombre/'+entidad.toString()+'/'+nombre;
    return this.http.get<[]>(this.urlEndPoint);
  }

  create(entidadContacto: EntidadContacto): Observable<EntidadContacto>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<EntidadContacto>(this.urlEndPoint,entidadContacto,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(entidadContacto: EntidadContacto): Observable<EntidadContacto>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+entidadContacto.id;
    return this.http.put<EntidadContacto>(this.urlEndPoint,entidadContacto,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(entidadContacto: Number): Observable<EntidadContacto>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+entidadContacto.toString();
    return this.http.delete<EntidadContacto>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  saveAll(entidadContacto: EntidadContacto[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/saveAll';

    return this.http.put<[]>(this.urlEndPoint,entidadContacto,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  deleteAll(entidadContacto: EntidadContacto[]): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/deleteAll';
      return this.http.put<[]>(this.urlEndPoint,entidadContacto,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
