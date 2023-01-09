import { Compania } from './../../models/pages/compania';
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
export class CompaniaService {

  //  private urlEndPoint: string = 'http://localhost:8060/compania';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Compania");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<Compania>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<Compania>(this.urlEndPoint);
  }

  getByCliente(cliente: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+cliente.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }
  getByClienteNombreLegal(cliente: Number,nombreLegal: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByNombreLegal/'+cliente.toString()+'/'+nombreLegal;
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByClienteNombreComercial(cliente: Number,nombreComercial: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByNombreComercial/'+cliente.toString()+'/'+nombreComercial;
    return this.http.get<[]>(this.urlEndPoint);
  }

  getExisteByClienteNombreLegal(cliente: Number,nombreLegal: string): Observable<Boolean>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/existenomlegal/'+cliente.toString()+'/'+nombreLegal;
    return this.http.get<Boolean>(this.urlEndPoint);
  }

  getExisteByClienteNombreComercial(cliente: Number,nombreComercial: string): Observable<Boolean>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/existenomcomercial/'+cliente.toString()+'/'+nombreComercial;
    return this.http.get<Boolean>(this.urlEndPoint);
  }

  getDefaultByCliente(cliente: Number): Observable<Compania>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/default/'+cliente.toString();
    return this.http.get<Compania>(this.urlEndPoint);
  }

  create(compania: Compania): Observable<Compania>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<Compania>(this.urlEndPoint,compania,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(compania: Compania): Observable<Compania>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+compania.id;
    return this.http.put<Compania>(this.urlEndPoint,compania,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }


  getValidaDelete(usuario: string,cliente: Number,compania: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/valdelete/'+usuario+'/'+cliente.toString()+'/'+compania.toString();
    return this.http.get<Number>(this.urlEndPoint);
  }

  delete(usuario: string,cliente: Number,compania: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+usuario+'/'+cliente.toString()+'/'+compania.toString();
//    return this.http.get<Number>(this.urlEndPoint);

    return this.http.get<Number>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

/*
  delete(compania: Number): Observable<Compania>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+compania.toString();
    return this.http.delete<Compania>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  */


  getFileExcelByCliente(cliente: Number){
    this.urlEndPoint = this.root+'/'+this.sistema+'/descargar/excel/lista/'+cliente.toString();
    return this.http.get(this.urlEndPoint, { responseType: 'blob' });
  }


  createContentFilePDF(companias: Compania[],
                    paises: Pais[],
                     estados: any[],
              ):any{

    var data = [];
    data.push(
      [{text: 'Nom. Legal',style:'tableHeader'},
      {text: 'Nom. Comercial',style:'tableHeader'},
      {text: 'Núm. Legal',style:'tableHeader'},
      {text: 'Telefono 1',style:'tableHeader'},
      {text: 'Telefono 2',style:'tableHeader'},
      {text: 'Pagina',style:'tableHeader'},
      {text: 'Pais',style:'tableHeader'},
      {text: 'Estado',style:'tableHeader'}],
     );

      companias.forEach(fila=>{

      data.push(
        [{text: fila.nombreLegal,style:'tableBody'},
         {text: fila.nombreComercial,style:'tableBody'},
         {text: fila.numeroRegLegal,style:'tableBody'},
         {text: fila.telefono1,style:'tableBody'},
         {text: fila.telefono2,style:'tableBody'},
         {text: fila.webpage,style:'tableBody'},
         {text: paises.find(e => e.id === fila.idPais).nombre,style:'tableBody'},
//        {text: fila.estado.toString(),style:'tableBody'}
          {text: (fila.estado == 1)?'Activo':'Baja',style:'tableBody'}
        ]
        );
  });

    const pdfDefinition = {
      //header: 'ERP PERU',
      pageSize: 'A4',
      pageOrientation: 'landscape', //'portrait'
      pageMargins: [ 40, 80, 40, 60 ], // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      header: {
        columns:[
          {text : 'ERP PERU', alignment: 'left' ,style: 'normalText', margin: [40, 20, 50, 0],fontSize: 15,bold: true,},
          {
          table: {
            widths: '*',
//            heights: '*',//30,
            body: [
                [ { text: 'Fecha : '+this.pipe.transform(Date.now(), 'dd/MM/yyyy'), alignment: 'right' ,style: 'normalText', margin: [0, 20, 50, 0],fontSize: 10}],
                [ { text: 'Hora  : '+this.pipe.transform(Date.now(), 'h:mm:ss a'), alignment: 'right' ,style: 'normalText', margin: [0, 0, 50, 0],fontSize: 10}],
              ]
                },
            layout: 'noBorders'
          }]
      /*
        columns: [
          '',
          { text: 'Fecha : '+this.todayWithPipe, alignment: 'right' ,style: 'normalText', margin: [0, 20, 50, 0],fontSize: 10}
        ]*/
      },

      //footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      footer: function (currentPage, pageCount) {
        return {
            table: {
                widths: '*',
                body: [
                    [{ text: "Pagina " + currentPage.toString() + ' de ' + pageCount,alignment: 'right',style: 'normalText', margin: [0, 20, 50, 0],fontSize: 10 }]
                    /*,[{ image: 'sampleImage.jpg', alignment: 'center', width: 200 },]*/
                ]
            },
            layout: 'noBorders'
        };
    },

      content:[
        {text: 'Relación de Compañias',style: 'sectionHeader'},
        {text: ' '},
        {
          table: {
              headerRows: 1,
              alignment: 'center',
             // widths: ['*', 'auto', 'auto', 'auto','auto','auto','auto'],
             widths: ['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto'],
              body: [
                ...data
              ]},
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 1)?'#F7F7F7': null;
                }
              },
      }
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
    };

    return pdfDefinition;
  }


}
