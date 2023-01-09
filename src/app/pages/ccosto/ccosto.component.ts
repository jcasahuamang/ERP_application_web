import { CCosto } from 'src/app/models/pages/ccosto';
import { TokenService } from './../../services/token.service';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { TabladetService } from 'src/app/services/pages/tabladet.service';
import { CcostoService } from 'src/app/services/pages/ccosto.service';
import { TablaDet } from 'src/app/models/pages/tabladet';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ccosto',
  templateUrl: './ccosto.component.html',
  styleUrls: ['./ccosto.component.css']
})
export class CcostoComponent implements OnInit {

  public ccosto: CCosto = new CCosto();
  public ccostos: CCosto[];

  public formCcosto: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public listaEstados: any[];
  public listaTipoCcosto: TablaDet[];

  public accionNuevo: Boolean = true;

  ccostosCol: string[] = ['Opciones', 'Nombre','Cód. Sup.','Estado'];
  ccostosData = new MatTableDataSource();

  @ViewChild('paginatorccostos', { static: true, read: MatPaginator }) paginatorccostos: MatPaginator;
  @ViewChild('closeCcosto') modalCcosto: ElementRef;



  constructor(private ccostoService: CcostoService,
    private estadoService: EstadoService,
    private tabladetService: TabladetService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.inicializarFormCcosto();
    this.onListCcostos();
    this.onListEstados();
    this.onListTipoCcosto();
  }

  inicializarFormCcosto(): void{
    this.formCcosto = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      tipo: ['', Validators.compose([Validators.maxLength(5)])],
      codigoUnidadSuperior: ['', Validators.compose([Validators.maxLength(5)])],
      estado:[1, Validators.required],

     })
  }

  onResetFormCcosto() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formCcosto.reset();
    this.formCcosto.get("idCompania").setValue(this.tokenService.getIdCompany());
    this.formCcosto.get("estado").setValue(1);

  }

  onListCcostos() {
    this.ccostoService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.ccostos = result;
          this.ccostosData.data = result;
          this.ccostosData.paginator = this.paginatorccostos;
        }, error => {
          console.log(error);
        }
      );
    }

    onListCcostosByNombre(nombre: string) {
      this.ccostoService.getByCompaniaNombre(this.tokenService.getIdCompany(),nombre).subscribe(
      (result) => {
            this.ccostos = result;
            this.ccostosData.data = result;
            this.ccostosData.paginator = this.paginatorccostos;
          }, error => {
            console.log(error);
          }
        );
      }

      onListEstados() {
        this.listaEstados = this.estadoService.estado;
      }

      onListTipoCcosto() {
        this.tabladetService.getByCompaniaTipo(this.tokenService.getIdCompany(),'SIS_TIPCCOS').subscribe(
          (result) => {
            this.listaTipoCcosto = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onSearchCcosto() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Nombre'){
            this.onListCcostosByNombre(this.searchInput);
          }
        } else {
          this.onListCcostos();
        }
      }

      private closeModalCcosto(): void {
        this.modalCcosto.nativeElement.click();
      }

      get f() {
        return this.formCcosto.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.formCcosto.invalid) {
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

                   this.ccostoService.create(this.formCcosto.value).subscribe(
                    (result) => {
                      if (result) {
                        this.onResetFormCcosto();
                        this.onListCcostos();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalCcosto();
                      } else {
                        this.closeModalCcosto();
                      }
                    }, error => {
                      console.log(error);
                    }
                  );
            }else{

                this.ccostoService.update(this.formCcosto.value).subscribe(
                  (result) => {
                    if (result) {
                      this.onResetFormCcosto();
                      this.onListCcostos();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalCcosto();
                    } else {
                      this.closeModalCcosto();
                    }
                  }, error => {
                    console.log(error);
                  }
                );
            }

          }
        })
      }

      onUpdateCcosto(ccosto: CCosto){
        this.accionNuevo = true;

        this.ccostoService.getById(ccosto.id).subscribe(
          (result) => {
            this.accionNuevo = false;
            this.formCcosto.patchValue({

              idCompania: result.idCompania,
              id: result.id,
              nombre: result.nombre,
              tipo: result.tipo,
              codigoUnidadSuperior: result.codigoUnidadSuperior,
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

      onDeleteCcosto(ccosto: CCosto){
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

            this.ccostoService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),ccosto.id).subscribe(
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
                  this.ccostoService.delete(ccosto.id).subscribe(
                    (result) => {
                      this.onListCcostos();
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
        this.ccostoService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
          (result) => {
            const url = window.URL.createObjectURL(result);
            window.open(url);
          }, error => {
            console.log(error);
          }
        );
      }


      onExportPdf() {

        const pdfDefinition = this.ccostoService.createContentFilePDF(
                                this.ccostos,
                                this.listaTipoCcosto,
                                this.listaEstados,
                                this.tokenService.getCompany());
       pdfMake.createPdf(pdfDefinition).open();

      }

}
