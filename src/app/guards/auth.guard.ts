import Swal  from 'sweetalert2';
import { MenuService } from 'src/app/services/shared/menu.service';
import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _userName: string;

  constructor(
    private menuService: MenuService,
    private tokenService: TokenService,
    private router: Router
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.tokenService.isAuthenticated()){
      this._userName = this.tokenService.getUserName();

      let _url: string = "";
      state.url.split("/").forEach(element => {
        if (_url === "")
          if (element !== "")
            _url = element;
      });
      return this.menuService.isPermit(this._userName, _url);

    }
    Swal.fire('Mensaje', `No tienes acceso`, 'error');
    this.router.navigate(['/login']);
    return false;
  }

}
