import { Injectable } from '@angular/core';
import { Menu } from 'src/app/models/shared/menu';
import { Submenu } from 'src/app/models/shared/submenu';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Configuracion } from '../configuracion-global';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MenuService {
 //  private urlEndPoint: string = 'http://localhost:8060/shared/menumodulos/{usuario}';
 //  private urlEndPoint: string = 'http://localhost:8060/shared/submenumodulos/{usuario}/{id_modulo}/{id_funcion_sup}';

 private config: Configuracion  = new Configuracion();
 private root: string = this.config.endPoints.get("Root");
 private sistema: string = this.config.endPoints.get("Shared");

 private urlEndPoint: string ;

 private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})


  constructor(private http: HttpClient) { }


  getMenu(usuario: string): Observable<Menu[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/menumodulos'+'/'+usuario;
    return this.http.get<Menu[]>(this.urlEndPoint);
  }

  getSubMenu(usuario: string,id_modulo: number,id_funcion_sup: number): Observable<Submenu[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/submenumodulos'+'/'+usuario+'/'+id_modulo+'/'+id_funcion_sup;
    return this.http.get<Submenu[]>(this.urlEndPoint);
  }

  isPermit(usuario: string, url: string): Observable<boolean> {
    this.urlEndPoint = this.root+'/'+this.sistema+'/submenumodulos/list'+'/'+usuario+'/'+url;
    return this.http.get<boolean>(this.urlEndPoint)
  }

}
