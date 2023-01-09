import { EstadoService } from './services/estado.service';
import { CompaniaService } from './services/pages/compania.service';
import { ClienteService } from './services/cliente.service';
import { PaisService } from './services/pais.service';
import { PlanService } from './services/plan.service';
import { ModuloService } from './services/modulo.service';
import { SistemaService } from './services/sistema.service';
import { MenuService } from './services/shared/menu.service';
import { interceptorProvider } from './interceptors/interceptor.service';

import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { NopageFoundComponent } from './nopage-found/nopage-found/nopage-found.component';
import { HttpClientModule } from '@angular/common/http';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListacompaniaComponent } from './views/pdf/listacompania/listacompania.component';

@NgModule({
  declarations: [
    AppComponent,
    NopageFoundComponent,
    ListacompaniaComponent,
  ],
  imports: [
    BrowserModule,

    AppRoutingModule,
    PagesModule,
    AuthModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    BrowserAnimationsModule,
  ],
  providers: [ClienteService,
              PaisService,
              PlanService,
              ModuloService,
              SistemaService,
              MenuService,
              CompaniaService,
              EstadoService,
              interceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
