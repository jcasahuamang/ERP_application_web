import swal from 'sweetalert2';
import { Plan } from './../models/plan';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable()
export class PlanService {
 //  private urlEndPoint: string = 'http://localhost:8060/sistema/planes';
 private config: Configuracion  = new Configuracion();
 private root: string = this.config.endPoints.get("Root");
 private sistema: string = this.config.endPoints.get("Sistema");

 private urlEndPoint: string = this.root+'/'+this.sistema+'/planes';
 private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})


  constructor(private http: HttpClient,private router: Router) { }

  getAll(): Observable<Plan[]>{
    return this.http.get<Plan[]>(this.urlEndPoint);
  }

  create(plan: Plan): Observable<Plan>{
    return this.http.post<Plan>(this.urlEndPoint,plan,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
