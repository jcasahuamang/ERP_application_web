import swal from 'sweetalert2';
import { Modulo } from './../models/modulo';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ModuloService {

 //  private urlEndPoint: string = 'http://localhost:8060/sistema/modulos';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Sistema");

  private urlEndPoint: string = this.root+'/'+this.sistema+'/modulos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})


  constructor(private http: HttpClient,private router: Router) {  }

  getAll(): Observable<Modulo[]>{
    return this.http.get<Modulo[]>(this.urlEndPoint);
  }

  create(modulo: Modulo): Observable<Modulo>{
    return this.http.post<Modulo>(this.urlEndPoint,modulo,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
