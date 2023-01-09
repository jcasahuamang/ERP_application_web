import swal from 'sweetalert2';
import { Cliente } from './../models/cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ClienteService {
//  private urlEndPoint: string = 'http://localhost:8060/sistema/clientes';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Sistema");

  private urlEndPoint: string = this.root+'/'+this.sistema+'/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient,private router: Router) { }

  create(cliente: Cliente): Observable<Cliente>{

    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
    
  }



}
