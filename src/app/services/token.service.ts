import { Injectable,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const IDCLIENT_KEY = 'AuthIdCliente';
const IDUSER_KEY = 'AuthIdUser';
const USERFULLNAME_KEY = 'AuthUserFullName';
const IDCOMPANY_KEY = 'AuthIdCompany';
const COMPANY_KEY = 'AuthCompany';
const IDPAISCOMPANY_KEY = 'AuthIdPaisCompany';
const IDESTADOCOMPANY_KEY = 'AuthIdEstadoCompany';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  roles: Array<string> = [];
  private _token: string;
  private _userName: string;
  private _idCliente: string;
  private _idUser: string;
  private _userFullName: string;
  private _idCompany: string;
  private _company: string;
  private _idPaisCompany: string;
  private _idEstadoCompany: string;


  constructor() { }


  public setToken(token: string): void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
  }

  public getToken():string {
    if (this._token!= null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem(TOKEN_KEY) != null){
      this._token = sessionStorage.getItem(TOKEN_KEY);
      return this._token;
    }
    return null;
  }

  public setUserName(userName: string): void{
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY,userName);
  }
  public getUserName():string {
    if (this._userName!= null){
      return this._userName;
    }else if(this._userName == null && sessionStorage.getItem(USERNAME_KEY) != null){
      this._userName = sessionStorage.getItem(USERNAME_KEY);
      return this._userName;
    }
    return null;
  }

  public setAuthorities(authorities: string[]): void{
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY,JSON.stringify(authorities));
  }
  public getAuthorities():string[] {
    this.roles = [];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }


  public setIdClient(idCliente: number):void {
    window.sessionStorage.removeItem(IDCLIENT_KEY);
    window.sessionStorage.setItem(IDCLIENT_KEY,idCliente.toString());
  }

  public getIdClient():number {
    if (this._idCliente!= null){
      return Number(this._idCliente);
    }else if(this._idCliente == null && sessionStorage.getItem(IDCLIENT_KEY) != null){
      this._idCliente = sessionStorage.getItem(IDCLIENT_KEY);
      return Number(this._idCliente);
    }
    return null;
  }


  public setIdUser(idUser: number):void {
    window.sessionStorage.removeItem(IDUSER_KEY);
    window.sessionStorage.setItem(IDUSER_KEY,idUser.toString());
  }

  public getIdUser():number {
    if (this._idUser!= null){
      return Number(this._idUser);
    }else if(this._idUser == null && sessionStorage.getItem(IDUSER_KEY) != null){
      this._idUser = sessionStorage.getItem(IDUSER_KEY);
      return Number(this._idUser);
    }
    return null;
  }

  public setUserFullName(useFullName: string):void {
    window.sessionStorage.removeItem(USERFULLNAME_KEY);
    window.sessionStorage.setItem(USERFULLNAME_KEY,useFullName);
  }

  public getUserFullName():string {
    if (this._userFullName!= null){
      return this._userFullName;
    }else if(this._userFullName == null && sessionStorage.getItem(USERFULLNAME_KEY) != null){
      this._userFullName = sessionStorage.getItem(USERFULLNAME_KEY);
      return this._userFullName;
    }
    return null;
  }

  isAuthenticated(): boolean{
    if (this.getToken() != null && this.getUserName()!= null){
      return true;
    }
    return false;
  }

  /********** VARIABLES GLOBALES **************************************/
  public setIdCompany(idCompany: number):void {
    window.sessionStorage.removeItem(IDCOMPANY_KEY);
    window.sessionStorage.setItem(IDCOMPANY_KEY,idCompany.toString());
  }

 public getIdCompany():number {
    this._idCompany = sessionStorage.getItem(IDCOMPANY_KEY);
    return Number(this._idCompany);

  }

  public setCompany(company: string):void {
    window.sessionStorage.removeItem(COMPANY_KEY);
    window.sessionStorage.setItem(COMPANY_KEY,company);
  }

  public getCompany():string {
    this._company = sessionStorage.getItem(COMPANY_KEY);
    return this._company;
  }

  public setIdPaisCompany(idPais: number):void {
    window.sessionStorage.removeItem(IDPAISCOMPANY_KEY);
    window.sessionStorage.setItem(IDPAISCOMPANY_KEY,idPais.toString());
  }

  public getIdPaisCompany():number {
    this._idPaisCompany = sessionStorage.getItem(IDPAISCOMPANY_KEY);
    return Number(this._idPaisCompany);
  }

  public setIdEstadoCompany(idEstado: number):void {
    window.sessionStorage.removeItem(IDESTADOCOMPANY_KEY);
    window.sessionStorage.setItem(IDESTADOCOMPANY_KEY,idEstado.toString());
  }

  public getIdEstadoCompany():number {
    this._idEstadoCompany = sessionStorage.getItem(IDESTADOCOMPANY_KEY);
    return Number(this._idEstadoCompany);
  }

  /********** VARIABLES GLOBALES **************************************/

  public logOut(): void{
    this._token = null;
    this._userName = null;
    this._idCliente = null;
    this._idUser = null;
    this._userFullName = null;
    this._idCompany = null;
    this._company = null;
    this._idPaisCompany= null;
    this._idEstadoCompany= null;
    window.sessionStorage.clear();
  }

}
