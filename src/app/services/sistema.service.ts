import swal from 'sweetalert2';
import { Sistema } from '../models/sistema';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Configuracion } from './configuracion-global';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class SistemaService {

   //  private urlEndPoint: string = 'http://localhost:8060/sistema/sistemas';
   private config: Configuracion  = new Configuracion();
   private root: string = this.config.endPoints.get("Root");
   private sistema: string = this.config.endPoints.get("Sistema");

   private urlEndPoint: string = this.root+'/'+this.sistema+'/sistemas';
   private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})


   constructor(private http: HttpClient,private router: Router) {  }

   getAll(): Observable<Sistema[]>{
    return this.http.get<Sistema[]>(this.urlEndPoint);
  }

}
