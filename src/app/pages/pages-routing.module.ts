import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';
import {CompaniaComponent} from './compania/compania.component';
import { SedeComponent } from './sede/sede.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { AuxiliarComponent } from './auxiliar/auxiliar.component';
import { TablaComponent } from './tabla/tabla.component';
import { CcostoComponent } from './ccosto/ccosto.component';
import { TipotransaccionComponent } from './tipotransaccion/tipotransaccion.component';

const routes: Routes = [
  {path: 'dashboard',component: PagesComponent,
  children:[
    {path: '',component: DashboardComponent,data:{ titulo:'Dashboard'},},
    {path: 'productos',component: ProductosComponent,data:{titulo:'Productos'},},
    {path: 'stocks',component: StockComponent,data:{titulo:'Stocks'},},
    {path: 'usuarios',component: UsuariosComponent,data:{titulo:'Usuarios'},},

    {path: 'inicio',component: ProductosComponent,data:{titulo:'Productos'},},
    {path: 'magemp',component: CompaniaComponent,data:{titulo:'Companias'},},
    {path: 'magsede',component: SedeComponent,data:{titulo:'Sedes'},},
    {path: 'magcosto',component: CcostoComponent,data:{titulo:'Centro de Costo'},},
    {path: 'magalma',component: AlmacenComponent,data:{titulo:'Almacenes'},},
    {path: 'magauxi',component: AuxiliarComponent,data:{titulo:'Auxiliares'},},
    {path: 'magtabla',component: TablaComponent,data:{titulo:'Tablas Generales'},},
    {path: 'almmaetipotransa',component: TipotransaccionComponent,data:{titulo:'Tipo Transaccion'},},
    {path: 'almmaearti',component: ProductosComponent,data:{titulo:'Articulos'},},
  ]
}
];

@NgModule({
  declarations: [],

  imports: [CommonModule,
            RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class PagesRoutingModule { }
