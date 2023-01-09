import { PaisService } from './../../services/pais.service';
import { Pais } from './../../models/pais';
import { TokenService } from './../../services/token.service';
import { Compania } from './../../models/pages/compania';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { CompaniaService } from 'src/app/services/pages/compania.service';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  styleUrls: ['./compania.component.css']
})
export class CompaniaComponent implements OnInit {
  public compania: Compania = new Compania();
  public companias: Compania[];

  public formCompania: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'NomLegal';

  public listaPaises: Pais[];
  public listaEstados: any[];

  public accionNuevo: Boolean = true;

  companiasCol: string[] = ['Opciones', 'Nom. Legal', 'Nom. Comercial', 'Núm. Legal','Telefono1','Telefono2','Pagina','Estado'];
  companiasData = new MatTableDataSource();

  @ViewChild('paginatorcompanias', { static: true, read: MatPaginator }) paginatorcompanias: MatPaginator;
  @ViewChild('closeCompania') modalCompania: ElementRef;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private companiaService: CompaniaService,
            private paisService: PaisService,
            private estadoService: EstadoService,
            private tokenService :TokenService,
            private fb: FormBuilder,
            private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inicializarFormCompania();
    this.onListCompanias();
    this.onListPaises();
    this.onListEstados();

    /*
    this.companiasData.sort = this.sort;
    const sortState: Sort = {active: 'Nom. Legal', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    */

  }



  inicializarFormCompania(): void{
    this.formCompania = this.fb.group({

      idCliente:[this.tokenService.getIdClient(), Validators.required],
      id:[],
      nombreLegal: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      nombreComercial: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      numeroRegLegal: ['', Validators.compose([Validators.maxLength(50)])],
      telefono1: ['', Validators.compose([Validators.maxLength(50)])],
      telefono2: ['', Validators.compose([Validators.maxLength(50)])],
      webpage: ['', Validators.compose([Validators.maxLength(250)])],
      idPais:[, Validators.required],
      estado:[1, Validators.required],

     })
  }

  onResetFormCompania() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formCompania.reset();
    this.formCompania.get("idCliente").setValue(this.tokenService.getIdClient());
    this.formCompania.get("estado").setValue(1);
//    this.form.controls["idCliente"].setValue(selected.id);
  }


  onListCompanias() {
  this.companiaService.getByCliente(this.tokenService.getIdClient()).subscribe(
  (result) => {
        this.companias = result;
        this.companiasData.data = result;
        this.companiasData.paginator = this.paginatorcompanias;


      }, error => {
        console.log(error);
      }
    );
  }

  onListCompaniasByNomLegal(nombre: string) {
    this.companiaService.getByClienteNombreLegal(this.tokenService.getIdClient(),nombre).subscribe(
    (result) => {
          this.companias = result;
          this.companiasData.data = result;
          this.companiasData.paginator = this.paginatorcompanias;
        }, error => {
          console.log(error);
        }
      );
    }
    onListCompaniasByNomComercial(nombre: string) {
      this.companiaService.getByClienteNombreComercial(this.tokenService.getIdClient(),nombre).subscribe(
      (result) => {
            this.companias = result;
            this.companiasData.data = result;
            this.companiasData.paginator = this.paginatorcompanias;
          }, error => {
            console.log(error);
          }
        );
      }

  onListPaises() {
    this.paisService.getAll().subscribe(
      (result) => {
        this.listaPaises = result;
//        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListEstados() {
    this.listaEstados = this.estadoService.estado;
  }

  onSearchCompania() {

    if (this.searchInput != null && this.searchInput != "") {
      if (this.selectedBusqueda == 'NomLegal'){
        this.onListCompaniasByNomLegal(this.searchInput);
      }else{
        if (this.selectedBusqueda == 'NomComercial'){
          this.onListCompaniasByNomComercial(this.searchInput);
        }
      }

    } else {
      this.onListCompanias();
    }
  }

  private closeModalCompania(): void {
    this.modalCompania.nativeElement.click();
  }

  get f() {
    return this.formCompania.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (this.formCompania.invalid) {
      return;
    }

    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        if (this.accionNuevo){
              this.companiaService.create(this.formCompania.value).subscribe(
                (result) => {
                  if (result) {
                    this.onResetFormCompania();
                    this.onListCompanias();
                    this.changeDetectorRefs.detectChanges();
                    this.toastAcceptedAlert("Se registro con exito");
                    this.closeModalCompania();
                  } else {
                    this.closeModalCompania();
                  }
                }, error => {
                  console.log(error);
                }
              );
        }else{

            this.companiaService.update(this.formCompania.value).subscribe(
              (result) => {
                if (result) {
                  this.onResetFormCompania();
                  this.onListCompanias();
                  this.changeDetectorRefs.detectChanges();
                  this.toastAcceptedAlert("Se registro con exito");
                  this.closeModalCompania();
                } else {
                  this.closeModalCompania();
                }
              }, error => {
                console.log(error);
              }
            );
        }

      }
    })
  }

  onUpdateCompania(compania: Compania){
    this.accionNuevo = true;

    this.companiaService.getById(compania.id).subscribe(
      (result) => {
        this.accionNuevo = false;
        this.formCompania.patchValue({
          idCliente: result.idCliente,
          id: result.id,
          nombreLegal: result.nombreLegal,
          nombreComercial: result.nombreComercial,
          numeroRegLegal: result.numeroRegLegal,
          telefono1: result.telefono1,
          telefono2: result.telefono2,
          webpage: result.webpage,
          idPais: result.idPais,
          estado: result.estado

        });


        }, error => {
          console.log(error);
        }
      );

  }

  toastAcceptedAlert(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }

  onDeleteCompania(compania: Compania){
    this.accionNuevo = false;

    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
//      if (result.value) {
    if (result.isConfirmed) {

        this.companiaService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),compania.id).subscribe(
          (result) => {
            if (result > 0){
              Swal.fire({
                title: 'Advertencia',
                text: `No se puede eliminar, existen registros asociados`,
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#17a2b8',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar!',
                cancelButtonText: 'cancelar'
              })/*.then((result) => {} )*/
            }else{
//              this.companiaService.delete(compania.id).subscribe(
                this.companiaService.delete(this.tokenService.getUserName(),this.tokenService.getIdClient(),compania.id).subscribe(
                (result) => {
                  this.onListCompanias();
                  this.changeDetectorRefs.detectChanges();
                  this.toastAcceptedAlert("Se Elimino con exito");
                  }, error => {
                    console.log(error);
                  }
              )
            }
          }, error => {
            console.log(error);
          }
        );

      }
    }
    )

  }

  onExportExcel() {
    this.companiaService.getFileExcelByCliente(this.tokenService.getIdClient()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }


  onExportPdf() {
    const pdfDefinition = this.companiaService.createContentFilePDF(
                              this.companias,
                              this.listaPaises,
                              this.listaEstados);

   // pdfMake.createPdf(pdfDefinition).open({},window);
   pdfMake.createPdf(pdfDefinition).open();
  }


}
