import { Entidad } from './../../models/pages/entidad';
import { RepMaeEntidad } from './../../models/pages/RepMaeEntidad';
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
export class EntidadService {


  //  private urlEndPoint: string = 'http://localhost:8060/entidad';
  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root");
  private sistema: string = this.config.endPoints.get("Entidad");

//  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }

  getById(id: Number): Observable<Entidad>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<Entidad>(this.urlEndPoint);
  }

  getByCompania(compania: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getListByCompaniaPDF(compania: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaDPF/'+compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByCompaniaNombre(compania: Number,nombre: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByNombre/'+compania.toString()+'/'+nombre;
    return this.http.get<[]>(this.urlEndPoint);
  }

  create(entidad: Entidad): Observable<Entidad>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<Entidad>(this.urlEndPoint,entidad,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(entidad: Entidad): Observable<Entidad>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+entidad.id;
    return this.http.put<Entidad>(this.urlEndPoint,entidad,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  getValidaDelete(usuario: string,cliente: Number,entidad: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/valdelete/'+usuario+'/'+cliente.toString()+'/'+entidad.toString();
    return this.http.get<Number>(this.urlEndPoint);
  }

  delete(usuario: string,cliente: Number,entidad: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+usuario+'/'+cliente.toString()+'/'+entidad.toString();

    return this.http.get<Number>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  /*
  delete(entidad: Number): Observable<Entidad>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+entidad.toString();
    return this.http.delete<Entidad>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  */

  getFileExcelByCompania(compania: Number){
    this.urlEndPoint = this.root+'/'+this.sistema+'/descargar/excel/lista/'+compania.toString();
    return this.http.get(this.urlEndPoint, { responseType: 'blob' });
  }


  createContentFilePDF(repmaeentidad: RepMaeEntidad[],nombreComercial: string):any{
    let data =[];
    data.push(
      [{text: 'Id Auxi.',style:'tableHeader'},
      {text: 'Nom. Completo',style:'tableHeader'},
      {text: 'Nom. Legal',style:'tableHeader'},
      {text: 'Nom. Comercial',style:'tableHeader'},
      {text: 'Tipo. Doc.',style:'tableHeader'},
      {text: 'Num. Doc.',style:'tableHeader'},
      {text: 'Tipo Auxi.',style:'tableHeader'},
      {text: 'Estado',style:'tableHeader'},
      {text: 'Email',style:'tableHeader'},
      {text: 'Telefono 1',style:'tableHeader'},
      {text: 'Telefono 2',style:'tableHeader'},
      {text: 'Pais',style:'tableHeader'} ],
     );

     repmaeentidad.forEach(fila=>{
      data.push(
        [{text: fila.id_entidad,style:'tableBody'},
         {text:((fila.nombre_primero == null)? '' : fila.nombre_primero) +' '+
               ((fila.nombre_segundo == null)? '': fila.nombre_segundo)+' '+
               ((fila.apellido_paterno == null)? '': fila.apellido_paterno)+' '+
               ((fila.apellido_materno == null)? '': fila.apellido_materno),style:'tableBody'},
//          {text: fila.nombre_primero,style:'tableBody'},
         {text: fila.nombre_legal,style:'tableBody'},
         {text: fila.nombre_comercial,style:'tableBody'},
         {text: fila.des_tipo_doc,style:'tableBody'},
         {text: fila.numero_documento,style:'tableBody'},
         {text: fila.tipo_entidad,style:'tableBody'},
         {text: fila.estado,style:'tableBody'},
         {text: fila.email,style:'tableBody'},
         {text: fila.telefono1,style:'tableBody'},
         {text: fila.telefono2,style:'tableBody'},
          {text: fila.pais,style:'tableBody'}
        ]
        );
  });


  const pdfDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape', //'portrait'
    pageMargins: [ 40, 80, 40, 60 ], // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    header: {
      columns:[
        {text : nombreComercial, alignment: 'left' ,style: 'normalText', margin: [40, 20, 50, 0],fontSize: 15,bold: true,},
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
      {text: 'Relación de Auxiliares',style: 'sectionHeader'},
      {text: ' '},
      {
        table: {
            headerRows: 1,
            alignment: 'center',
           // widths: ['*', 'auto', 'auto', 'auto','auto','auto','auto'],
           widths: ['auto', 'auto', 'auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto'],
           //widths: ['auto', 'auto', 'auto'],
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
