import { filter, map } from 'rxjs/operators';
import { ActivationEnd, Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent {

  public titulo: string = '';

  constructor(private router: Router,private activateRoute: ActivatedRoute) {
  this.getArmunents();

}

getArmunents(){
  this.router.events.subscribe(event => {
    if (event instanceof ActivationEnd) {
      if (this.activateRoute.snapshot.firstChild?.data){
        this.titulo = this.activateRoute.snapshot.firstChild?.data.titulo;
      document.title = 'Application - '+ this.titulo;

        }
      }
  });
}

}
