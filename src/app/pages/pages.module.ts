import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ProductosComponent } from './productos/productos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { StockComponent } from './stock/stock.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CompaniaComponent } from './compania/compania.component';
import { SedeComponent } from './sede/sede.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { TablaComponent } from './tabla/tabla.component';
import { CcostoComponent } from './ccosto/ccosto.component';
import { RepsaldomesComponent } from './repsaldomes/repsaldomes.component';
import { RepalmasaldocieComponent } from './repalmasaldocie/repalmasaldocie.component';
import { AuxiliarComponent } from './auxiliar/auxiliar.component';
import { TipotransaccionComponent } from './tipotransaccion/tipotransaccion.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProductosComponent,
    StockComponent,
    PagesComponent,
    UsuariosComponent,
    CompaniaComponent,
    SedeComponent,
    AlmacenComponent,
    TablaComponent,
    CcostoComponent,
    RepsaldomesComponent,
    RepalmasaldocieComponent,
    AuxiliarComponent,
    TipotransaccionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  exports:[
    DashboardComponent,
    ProductosComponent,
    StockComponent,
    PagesComponent,
    UsuariosComponent
  ]
})
export class PagesModule { }
