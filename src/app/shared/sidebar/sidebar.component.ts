import { TokenService } from './../../services/token.service';
import { SidebarService } from './../../services/sidebar.service';
import { MenuService } from 'src/app/services/shared/menu.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Menu } from 'src/app/models/shared/menu';
import { Submenu } from 'src/app/models/shared/submenu';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

//  menuItems: any[];
  isLogged = false;

  public menus: Menu[];
  public submenus: Submenu[];
  public subsubmenu: Submenu[];
  public usuario: string;
  public usuarioFullName: string;
  public compania: string = "Sin Compañia";

/*
  constructor(
    private tokenService: TokenService,
    private sidebarService: SidebarService) {
  this.menuItems = sidebarService.menu;

  }
  */
  constructor(
    private tokenService: TokenService,
    private menuService: MenuService) {

  }


  ngOnInit(): void {
    if (this.tokenService.getToken()){
      this.isLogged = true;
      this.loadAccessMenu();
    }else{
      this.isLogged=false;
    }

/*
    this.tokenService.nomCompany$.subscribe( texto=>{
      console.log("11 "+texto);
      this.compania = texto;
      console.log("22 "+this.compania);
    })
    */
}

  loadAccessMenu() {

    this.usuario = this.tokenService.getUserName();
      if (this.usuario != null) {
        this.accessMenu(this.usuario);
      }

    this.usuarioFullName = this.tokenService.getUserFullName();

  }


  accessMenu(usuario: string) {
    this.menuService.getMenu(usuario).subscribe(
      (result) => {
        this.menus = result;
        this.menus.forEach(menu => {
          this.menuService.getSubMenu(usuario, menu.id_modulo,0).subscribe(
            (result) => {
              //console.log(result);
              menu.maefuncion = result;
              result.forEach(sub => {
                if (sub.des_url == null && sub.id_funcion_sup == null) {
                  this.menuService.getSubMenu(usuario, sub.id_modulo,sub.id_funcion).subscribe(
                    (result) => {
                      //console.log(result);
                      sub.submenu = result;
                      sub.submenu.forEach(subsub => {
                        if (subsub.des_url == null && subsub.id_funcion_sup != null) {
                          this.menuService.getSubMenu(usuario, subsub.id_modulo,subsub.id_funcion).subscribe(
                            (result) => {
                              subsub.submenu = result;
                              //console.log(subsub.submenu);
                            }, error => {
                              console.log(error);
                            }
                          );
                        }
                      });
                    }, error => {
                      console.log(error);
                    }
                  );
                }
              });



            }, error => {
              console.log(error);
            }
          );



        });


      }, error => {
        console.log(error);
      }
    );
  }

}
