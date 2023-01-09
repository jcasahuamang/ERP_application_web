import { JwtDTO } from './../models/jwt-dto';
import { LoginUsuario } from './../models/login-usuario';
import { NuevoUsuario } from './../models/nuevo-usuario';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from './configuracion-global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //authURL = 'http://localhost:8060/auth/';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private Auth: string = this.config.endPoints.get("Auth");

  private authURL: string = this.root+'/'+this.Auth+'/';


  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsario: NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authURL+'nuevo',nuevoUsario);
  }

  public login(loginUsario: LoginUsuario): Observable<JwtDTO>{
     return this.httpClient.post<JwtDTO>(this.authURL+'login',loginUsario);

}


}
