import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  estado: any[] = [
    {id: 1,nombre:'Activo'},
    {id: 0,nombre:'Baja'}
  ];
  constructor() { }
}
