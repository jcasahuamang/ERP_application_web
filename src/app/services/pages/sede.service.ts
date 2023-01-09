import { Sede } from './../../models/pages/sede';
import swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuracion } from './../configuracion-global';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Pais } from 'src/app/models/pais';

@Injectable({
  providedIn: 'root'
})
export class SedeService {


  //  private urlEndPoint: string = 'http://localhost:8060/sede';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Sede");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<Sede>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<Sede>(this.urlEndPoint);
  }

  getByCompania(compania: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByCompaniaNombre(compania: Number,nombre: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByNombre/'+compania.toString()+'/'+nombre;
    return this.http.get<[]>(this.urlEndPoint);
  }

  getDefaultByCompania(compania: Number): Observable<Sede>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/default/'+compania.toString();
    return this.http.get<Sede>(this.urlEndPoint);
  }

  create(sede: Sede): Observable<Sede>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<Sede>(this.urlEndPoint,sede,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(sede: Sede): Observable<Sede>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+sede.id;
    return this.http.put<Sede>(this.urlEndPoint,sede,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }


  getValidaDelete(usuario: string,cliente: Number,sede: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/valdelete/'+usuario+'/'+cliente.toString()+'/'+sede.toString();
    return this.http.get<Number>(this.urlEndPoint);
  }

  delete(sede: Number): Observable<Sede>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+sede.toString();
    return this.http.delete<Sede>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  getFileExcelByCompania(compania: Number){
    this.urlEndPoint = this.root+'/'+this.sistema+'/descargar/excel/lista/'+compania.toString();
    return this.http.get(this.urlEndPoint, { responseType: 'blob' });
  }
  createContentFilePDF(sedes: Sede[],
                       paises: Pais[],
                       estados: any[],
                       nombreComercial: string):any{

    var data = [];
    data.push(
      [{text: 'Nombre',style:'tableHeader'},
      {text: 'Direccion',style:'tableHeader'},
      {text: 'Telefono 1',style:'tableHeader'},
      {text: 'Telefono 2',style:'tableHeader'},
      {text: 'Pais',style:'tableHeader'},
      {text: 'Estado',style:'tableHeader'}],
     );

     sedes.forEach(fila=>{

      data.push(
        [{text: fila.nombre,style:'tableBody'},
         {text: fila.direccion,style:'tableBody'},
         {text: fila.telefono1,style:'tableBody'},
         {text: fila.telefono2,style:'tableBody'},
         {text: paises.find(e => e.id === fila.idPais).nombre,style:'tableBody'},
//        {text: (fila.estado == 1)?'Activo':'Baja',style:'tableBody'}
          {text: estados.find(e => e.id === fila.estado).nombre,style:'tableBody'}
        ]
        );
  });


  const pdfDefinition = {
      //header: 'ERP PERU',
      pageSize: 'A4',
      pageOrientation: 'portrait', //landscape','portrait'
      pageMargins: [ 40, 80, 40, 60 ], // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      header: {
        columns:[
          {text : nombreComercial, alignment: 'left' ,style: 'normalText', margin: [40, 20, 50, 0],fontSize: 12,bold: true,},
          {
          table: {
            widths: '*',
            body: [
                [ { text: 'Fecha : '+this.pipe.transform(Date.now(), 'dd/MM/yyyy'), alignment: 'right' ,style: 'normalText', margin: [0, 20, 50, 0],fontSize: 10}],
                [ { text: 'Hora  : '+this.pipe.transform(Date.now(), 'h:mm:ss a'), alignment: 'right' ,style: 'normalText', margin: [0, 0, 50, 0],fontSize: 10}],
              ]
                },
            layout: 'noBorders'
          }]
      },
      footer: function (currentPage, pageCount) {
        return {
            table: {
                widths: '*',
                body: [
                    [{ text: "Pagina " + currentPage.toString() + ' de ' + pageCount,alignment: 'right',style: 'normalText', margin: [0, 20, 50, 0],fontSize: 10 }]
                ]
            },
            layout: 'noBorders'
        };
    },
    content: [
      {text: 'Relación de Sedes',style: 'sectionHeader'},
      {text: ' '},
      {
        table: {
          headerRows: 1,
          alignment: 'center',
          widths: ['auto', 'auto', 'auto', 'auto','auto','auto'],
          body: [
            ...data
          ]},
          layout: {
          fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 1)?'#F7F7F7': null;
          }
        },
      },

    ],
    styles: {
        sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15],
            alignment: 'center'},
        tableHeader: {
              bold: true,
              fontSize: 10,
              fillColor: '#7CC4B3', //'#eeeeff',
              color: '#FFFFFF',
              //margin: [0, 15, 0, 15],
              alignment: 'center' //'justify'
            },
         tableBody: {
              fontSize: 9,},
    }

  }

    return pdfDefinition;
  }

}
