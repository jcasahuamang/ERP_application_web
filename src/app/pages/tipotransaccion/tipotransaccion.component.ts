
import { TokenService } from './../../services/token.service';
import { TipoTransaccion } from './../../models/pages/tipotransaccion';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TipotransaccionService } from 'src/app/services/pages/tipotransaccion.service';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { TabladetService } from 'src/app/services/pages/tabladet.service';
import { TablaDet } from 'src/app/models/pages/tabladet';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-tipotransaccion',
  templateUrl: './tipotransaccion.component.html',
  styleUrls: ['./tipotransaccion.component.css']
})
export class TipotransaccionComponent implements OnInit {

  public transaccion: TipoTransaccion = new TipoTransaccion();
  public transacciones: TipoTransaccion[];

  public formTransaccion: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public listaEstados: any[];
  public listaTipo: TablaDet[];

  public accionNuevo: Boolean = true;

  transaccionesCol: string[] = ['Opciones', 'Nombre','Abreviatura','Tipo','Estado'];
  transaccionesData = new MatTableDataSource();

  @ViewChild('paginatortransacciones', { static: true, read: MatPaginator }) paginatortransacciones: MatPaginator;
  @ViewChild('closeTransaccion') modalTransaccion: ElementRef;

  constructor(private tipoTransaccionService: TipotransaccionService,
    private estadoService: EstadoService,
    private tabladetService: TabladetService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.inicializarFormTransaccion();
    this.onListTransacciones();
    this.onListEstados();
    this.onListTipo();
  }

  inicializarFormTransaccion(): void{
    this.formTransaccion = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      abreviatura: ['', Validators.compose([Validators.maxLength(25)])],
      tipo: ['', Validators.compose([Validators.maxLength(3)])],
      indSalini: ['N', Validators.compose([Validators.maxLength(1)])],
      indInterno: ['N', Validators.compose([Validators.maxLength(1)])],
      indExterno: ['N', Validators.compose([Validators.maxLength(1)])],
      estado:[1, Validators.required],
      Salini:[false],
      Interno:[false],
      Externo:[false],

     })
  }

  onResetFormTransaccion() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formTransaccion.reset();
    this.formTransaccion.get("idCompania").setValue(this.tokenService.getIdCompany());
    this.formTransaccion.get("estado").setValue(1);
  }

  onListTransacciones() {
    this.tipoTransaccionService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.transacciones = result;
          this.transaccionesData.data = result;
          this.transaccionesData.paginator = this.paginatortransacciones;
        }, error => {
          console.log(error);
        }
      );
    }

    onListTransaccionesByNombre(nombre: string) {
      this.tipoTransaccionService.getByCompaniaNombre(this.tokenService.getIdCompany(),nombre).subscribe(
      (result) => {
            this.transacciones = result;
            this.transaccionesData.data = result;
            this.transaccionesData.paginator = this.paginatortransacciones;
          }, error => {
            console.log(error);
          }
        );
      }

      onListEstados() {
        this.listaEstados = this.estadoService.estado;
      }

      onListTipo() {
        this.tabladetService.getByCompaniaTipo(this.tokenService.getIdCompany(),'SIS_TMOVALM').subscribe(
          (result) => {
            this.listaTipo = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onSearchTransaccion() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Nombre'){
            this.onListTransaccionesByNombre(this.searchInput);
          }
        } else {
          this.onListTransacciones();
        }
      }


      private closeModalTransaccion(): void {
        this.modalTransaccion.nativeElement.click();
      }

      get f() {
        return this.formTransaccion.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.formTransaccion.invalid) {
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

                  this.formTransaccion.get("indSalini").setValue('N');
                 if(this.formTransaccion.get("Salini").value == true){this.formTransaccion.get("indSalini").setValue('S');}

                 this.formTransaccion.get("indInterno").setValue('N');
                 if(this.formTransaccion.get("Interno").value == true){this.formTransaccion.get("indInterno").setValue('S');}

                 this.formTransaccion.get("indExterno").setValue('N');
                 if(this.formTransaccion.get("Externo").value == true){this.formTransaccion.get("indExterno").setValue('S');}

                  this.tipoTransaccionService.create(this.formTransaccion.value).subscribe(
                    (result) => {
                      if (result) {
                        this.onResetFormTransaccion();
                        this.onListTransacciones();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalTransaccion();
                      } else {
                        this.closeModalTransaccion();
                      }
                    }, error => {
                      console.log(error);
                    }
                  );
            }else{

              this.formTransaccion.get("indSalini").setValue('N');
              if(this.formTransaccion.get("Salini").value == true){this.formTransaccion.get("indSalini").setValue('S');}

              this.formTransaccion.get("indInterno").setValue('N');
              if(this.formTransaccion.get("Interno").value == true){this.formTransaccion.get("indInterno").setValue('S');}

              this.formTransaccion.get("indExterno").setValue('N');
              if(this.formTransaccion.get("Externo").value == true){this.formTransaccion.get("indExterno").setValue('S');}

                this.tipoTransaccionService.update(this.formTransaccion.value).subscribe(
                  (result) => {
                    if (result) {
                      this.onResetFormTransaccion();
                      this.onListTransacciones();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalTransaccion();
                    } else {
                      this.closeModalTransaccion();
                    }
                  }, error => {
                    console.log(error);
                  }
                );
            }

          }
        })
      }


      onUpdateTransaccion(transaccion: TipoTransaccion){
        this.accionNuevo = true;

        this.tipoTransaccionService.getById(transaccion.id).subscribe(
          (result) => {
            this.accionNuevo = false;
            this.formTransaccion.patchValue({

              idCompania: result.idCompania,
              id: result.id,
              nombre: result.nombre,
              abreviatura: result.abreviatura,
              tipo: result.tipo,
              indSalini: result.indSalini,
              indInterno: result.indInterno,
              indExterno: result.indExterno,
              estado: result.estado

            });

            /* Si indSalini es "S", entonces this.Salini es TRUE, caso contrario false **/
 //           this.Salini=(this.formAlmacen.get("indSalini").value == 'S')?true:false;
          if(this.formTransaccion.get("indSalini").value == 'S'){
            this.formTransaccion.get("Salini").setValue(true);
          }else{
            this.formTransaccion.get("Salini").setValue(false);
          }

          if(this.formTransaccion.get("indInterno").value == 'S'){
            this.formTransaccion.get("Interno").setValue(true);
          }else{
            this.formTransaccion.get("Interno").setValue(false);
          }

          if(this.formTransaccion.get("indExterno").value == 'S'){
            this.formTransaccion.get("Externo").setValue(true);
          }else{
            this.formTransaccion.get("Externo").setValue(false);
          }

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

      onDeleteTransaccion(transaccion: TipoTransaccion){
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

            this.tipoTransaccionService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),transaccion.id).subscribe(
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
                    this.tipoTransaccionService.delete(this.tokenService.getUserName(),this.tokenService.getIdClient(),transaccion.id).subscribe(
                    (result) => {
                      this.onListTransacciones();
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
        this.tipoTransaccionService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
          (result) => {
            const url = window.URL.createObjectURL(result);
            window.open(url);
          }, error => {
            console.log(error);
          }
        );
      }

      onExportPdf() {
        const pdfDefinition = this.tipoTransaccionService.createContentFilePDF(
          this.transacciones,
          this.listaTipo,
          this.listaEstados,
          this.tokenService.getCompany());
      pdfMake.createPdf(pdfDefinition).open();

      }
}
