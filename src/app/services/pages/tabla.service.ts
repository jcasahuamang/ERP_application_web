import swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuracion } from './../configuracion-global';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tabla } from 'src/app/models/pages/tabla';
import { RepMaeTabla } from 'src/app/models/pages/RepMaeTabla';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

    //  private urlEndPoint: string = 'http://localhost:8060/tabla';
    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root");
    private sistema: string = this.config.endPoints.get("Tabla");

  //  private urlEndPoint: string = this.root+'/'+this.sistema;
    private urlEndPoint: string;
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

    today: Date = new Date();
    pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) { }


  getById(id: Number): Observable<Tabla>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+id.toString();
    return this.http.get<Tabla>(this.urlEndPoint);
  }

  getByCompania(compania: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/lista/'+compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getListByCompaniaPDF(compania: Number): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaDPF/'+compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByCompaniaTipo(compania: Number,tipo: string): Observable<[]>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/listaByTipo/'+compania.toString()+'/'+tipo;
    return this.http.get<[]>(this.urlEndPoint);
  }


  create(tabla: Tabla): Observable<Tabla>{
    this.urlEndPoint = this.root+'/'+this.sistema;
    return this.http.post<Tabla>(this.urlEndPoint,tabla,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );

  }

  update(tabla: Tabla): Observable<Tabla>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/'+tabla.id;
    return this.http.put<Tabla>(this.urlEndPoint,tabla,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(usuario: string,cliente: Number,tabla: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+usuario+'/'+cliente.toString()+'/'+tabla.toString();
//    return this.http.get<Number>(this.urlEndPoint);

    return this.http.get<Number>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
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


  createContentFilePDF(repmaetabla: RepMaeTabla[],nombreComercial: string):any{
    let data =[];
    data.push(
      [{text: 'Tipo Tabla',style:'tableHeader'},
      {text: 'Des. Tabla',style:'tableHeader'},
      {text: 'Código',style:'tableHeader'},
      {text: 'Des. Código',style:'tableHeader'},
      {text: 'Valor Ini.',style:'tableHeader'},
      {text: 'Valor. Fin',style:'tableHeader'},
      {text: 'Visible',style:'tableHeader'}],
     );

     repmaetabla.forEach(fila=>{
      data.push(
        [{text: fila.tipo_tabla,style:'tableBody'},
         {text: fila.des_tipo_tabla,style:'tableBody'},
         {text: fila.codigo,style:'tableBody'},
         {text: fila.des_codigo,style:'tableBody'},
         {text: fila.valor_ini,style:'tableBody'},
         {text: fila.valor_fin,style:'tableBody'},
          {text: fila.ind_visible,style:'tableBody'}
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
      {text: 'Relación de Tablas',style: 'sectionHeader'},
      {text: ' '},
      {
        table: {
            headerRows: 1,
            alignment: 'center',
           // widths: ['*', 'auto', 'auto', 'auto','auto','auto','auto'],
           widths: ['auto', 'auto', 'auto', 'auto','auto','auto','auto'],
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
