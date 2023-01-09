import swal from 'sweetalert2';
import { Cliente } from './../models/cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmailRequest } from '../models/emailrequest';
import { EmailResponse } from '../models/emailresponse';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  //  private urlEndPoint: string = 'http://localhost:8060/email';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Email");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient) { }


  EmailConfirmacion(emailRequest: EmailRequest): Observable<EmailResponse>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/confirmaregistro';
    return this.http.post<EmailResponse>(this.urlEndPoint,emailRequest,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

}
