import { AuthRoutingModule } from './auth/auth-routing.module';
import { NopageFoundComponent } from './nopage-found/nopage-found/nopage-found.component';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch: 'full'},
  {path:'**', component: NopageFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
        PagesRoutingModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
