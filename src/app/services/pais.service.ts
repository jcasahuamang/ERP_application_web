import swal from 'sweetalert2';
import { Pais } from './../models/pais';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class PaisService {
//  private urlEndPoint: string = 'http://localhost:8060/sistema/paises';
private config: Configuracion  = new Configuracion();
private root: string = this.config.endPoints.get("Root");
private sistema: string = this.config.endPoints.get("Sistema");

private urlEndPoint: string = this.root+'/'+this.sistema+'/paises';
private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient,private router: Router) {}

  getAll(): Observable<Pais[]>{
    return this.http.get<Pais[]>(this.urlEndPoint);
  }

  create(pais: Pais): Observable<Pais>{
    return this.http.post<Pais>(this.urlEndPoint,pais,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
