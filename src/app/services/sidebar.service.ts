import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [{
    titulo: 'Dashboard',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      {titulo:'Productos',url:'productos',icono:"fab fa-product-hunt nav-icon ml-3"},
      {titulo:'Stock',url:'stocks',icono:"fab fa-product-hunt nav-icon ml-3"}
    ]
   },
   {
    titulo: 'Planilla',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      {titulo:'Personal',url:'usuarios',icono:"far fa-user nav-icon ml-3"}
    ]
   },
   {
    titulo: 'Seguridad',
    icono:'nav-icon fas fa-tachometer-alt',
    submenu:[
      {titulo:'Usuarios',url:'usuarios',icono:"far fa-user nav-icon ml-3"}
    ]
   }

  ];

  constructor() { }
}
