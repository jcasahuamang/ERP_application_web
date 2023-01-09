import { TipoTransaccion } from './../../models/pages/tipotransaccion';
import { TablaDet } from './../../models/pages/tabladet';
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
  providedIn: 'root',
})
export class TipotransaccionService {
  //  private urlEndPoint: string = 'http://localhost:8060/tipotransaccion';
  private config: Configuracion = new Configuracion();
  private root: string = this.config.endPoints.get('Root');
  private sistema: string = this.config.endPoints.get('TipoTransaccion');

  //  private urlEndPoint: string = this.root+'/'+this.sistema;
  private urlEndPoint: string;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  today: Date = new Date();
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient) {}

  getById(id: Number): Observable<TipoTransaccion> {
    this.urlEndPoint = this.root + '/' + this.sistema + '/' + id.toString();
    return this.http.get<TipoTransaccion>(this.urlEndPoint);
  }

  getByCompania(compania: Number): Observable<[]> {
    this.urlEndPoint =
      this.root + '/' + this.sistema + '/lista/' + compania.toString();
    return this.http.get<[]>(this.urlEndPoint);
  }

  getByCompaniaNombre(compania: Number, nombre: string): Observable<[]> {
    this.urlEndPoint =
      this.root +
      '/' +
      this.sistema +
      '/listaByNombre/' +
      compania.toString() +
      '/' +
      nombre;
    return this.http.get<[]>(this.urlEndPoint);
  }

  create(tipoTransaccion: TipoTransaccion): Observable<TipoTransaccion> {
    this.urlEndPoint = this.root + '/' + this.sistema;
    return this.http
      .post<TipoTransaccion>(this.urlEndPoint, tipoTransaccion, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  update(tipoTransaccion: TipoTransaccion): Observable<TipoTransaccion> {
    this.urlEndPoint =
      this.root + '/' + this.sistema + '/' + tipoTransaccion.id;
    return this.http
      .put<TipoTransaccion>(this.urlEndPoint, tipoTransaccion, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getValidaDelete(usuario: string,cliente: Number,transaccion: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/valdelete/'+usuario+'/'+cliente.toString()+'/'+transaccion.toString();
    return this.http.get<Number>(this.urlEndPoint);
  }

  delete(usuario: string,cliente: Number,transaccion: Number): Observable<Number>{
    this.urlEndPoint = this.root+'/'+this.sistema+'/delete/'+usuario+'/'+cliente.toString()+'/'+transaccion.toString();

    return this.http.get<Number>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  /*
  delete(tipoTransaccion: Number): Observable<TipoTransaccion> {
    this.urlEndPoint =
      this.root + '/' + this.sistema + '/delete/' + tipoTransaccion.toString();
    return this.http
      .delete<TipoTransaccion>(this.urlEndPoint, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }
*/
  getFileExcelByCompania(compania: Number) {
    this.urlEndPoint =
      this.root +
      '/' +
      this.sistema +
      '/descargar/excel/lista/' +
      compania.toString();
    return this.http.get(this.urlEndPoint, { responseType: 'blob' });
  }

  createContentFilePDF(
    transaccion: TipoTransaccion[],
    tablaDet: TablaDet[],
    estados: any[],
    nombreComercial: string
  ): any {
    var data = [];
    data.push([
      { text: 'Nombre', style: 'tableHeader' },
      { text: 'Abreviatura', style: 'tableHeader' },
      { text: 'Tipo', style: 'tableHeader' },
      { text: 'Estado', style: 'tableHeader' },
      { text: 'Saldo Ini.', style: 'tableHeader' },
      { text: 'Transf. Int.', style: 'tableHeader' },
      { text: 'Transf. Ext.', style: 'tableHeader' },
    ]);

    transaccion.forEach((fila) => {
      data.push([
        { text: fila.nombre, style: 'tableBody' },
        { text: fila.abreviatura, style: 'tableBody' },
        {
          text:
            fila.tipo == null
              ? fila.tipo
              : tablaDet.find((e) => e.codigo === fila.tipo).nombre,
          style: 'tableBody',
        },
        {
          text: estados.find((e) => e.id === fila.estado).nombre,
          style: 'tableBody',
        },
        { text: fila.indSalini == 'S' ? 'SI' : 'NO', style: 'tableBody' },
        { text: fila.indInterno == 'S' ? 'SI' : 'NO', style: 'tableBody' },
        { text: fila.indExterno == 'S' ? 'SI' : 'NO', style: 'tableBody' },
      ]);
    });

    const pdfDefinition = {
      //header: 'ERP PERU',
      pageSize: 'A4',
      pageOrientation: 'portrait', //landscape','portrait'
      pageMargins: [40, 80, 40, 60], // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      header: {
        columns: [
          {
            text: nombreComercial,
            alignment: 'left',
            style: 'normalText',
            margin: [40, 20, 50, 0],
            fontSize: 12,
            bold: true,
          },
          {
            table: {
              widths: '*',
              body: [
                [
                  {
                    text:
                      'Fecha : ' +
                      this.pipe.transform(Date.now(), 'dd/MM/yyyy'),
                    alignment: 'right',
                    style: 'normalText',
                    margin: [0, 20, 50, 0],
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      'Hora  : ' + this.pipe.transform(Date.now(), 'h:mm:ss a'),
                    alignment: 'right',
                    style: 'normalText',
                    margin: [0, 0, 50, 0],
                    fontSize: 10,
                  },
                ],
              ],
            },
            layout: 'noBorders',
          },
        ],
      },
      footer: function (currentPage, pageCount) {
        return {
          table: {
            widths: '*',
            body: [
              [
                {
                  text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount,
                  alignment: 'right',
                  style: 'normalText',
                  margin: [0, 20, 50, 0],
                  fontSize: 10,
                },
              ],
            ],
          },
          layout: 'noBorders',
        };
      },
      content: [
        { text: 'Relación de Centros de Costo', style: 'sectionHeader' },
        { text: ' ' },
        {
          table: {
            headerRows: 1,
            alignment: 'center',
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [...data],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 1 ? '#F7F7F7' : null;
            },
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#7CC4B3', //'#eeeeff',
          color: '#FFFFFF',
          alignment: 'center', //'justify'
        },
        tableBody: {
          fontSize: 9,
        },
      },
    };

    return pdfDefinition;
  }
}
