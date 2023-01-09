import { PaisService } from './../../services/pais.service';
import { Pais } from './../../models/pais';
import { TokenService } from './../../services/token.service';
import { Almacen } from './../../models/pages/almacen';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlmacenService } from 'src/app/services/pages/almacen.service';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { TabladetService } from 'src/app/services/pages/tabladet.service';
import { TablaDet } from 'src/app/models/pages/tabladet';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {

  public almacen: Almacen = new Almacen();
  public almacenes: Almacen[];

  public formAlmacen: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public listaPaises: Pais[];
  public listaEstados: any[];
  public listaTipoAlmacen: TablaDet[];

  public accionNuevo: Boolean = true;

  almacenesCol: string[] = ['Opciones', 'Nombre','Direccion','Estado'];
  almacenesData = new MatTableDataSource();

  @ViewChild('paginatoralmacenes', { static: true, read: MatPaginator }) paginatoralmacenes: MatPaginator;
  @ViewChild('closeAlmacen') modalAlmacen: ElementRef;

  constructor(private almacenService: AlmacenService,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private tabladetService: TabladetService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inicializarFormAlmacen();
    this.onListAlmacenes();
    this.onListPaises();
    this.onListEstados();
    this.onListTipoAlmacen();
  }

  inicializarFormAlmacen(): void{
    this.formAlmacen = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      tipo: ['', Validators.compose([Validators.maxLength(5)])],
      direccion: ['', Validators.compose([Validators.maxLength(250)])],
      indVirtual: ['N', Validators.compose([Validators.maxLength(2)])],
      idPais:[this.tokenService.getIdPaisCompany(), Validators.required],
      estado:[1, Validators.required],
      virtual:[false],

     })
  }

  onResetFormAlmacen() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formAlmacen.reset();
    this.formAlmacen.get("idCompania").setValue(this.tokenService.getIdCompany());
    this.formAlmacen.get("idPais").setValue(this.tokenService.getIdPaisCompany());
    this.formAlmacen.get("estado").setValue(1);

  }

  onListAlmacenes() {
    this.almacenService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.almacenes = result;
          this.almacenesData.data = result;
          this.almacenesData.paginator = this.paginatoralmacenes;
        }, error => {
          console.log(error);
        }
      );
    }

    onListAlmacenesByNombre(nombre: string) {
      this.almacenService.getByCompaniaNombre(this.tokenService.getIdCompany(),nombre).subscribe(
      (result) => {
            this.almacenes = result;
            this.almacenesData.data = result;
            this.almacenesData.paginator = this.paginatoralmacenes;
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

      onListTipoAlmacen() {
        this.tabladetService.getByCompaniaTipo(this.tokenService.getIdCompany(),'SIS_TIPALMA').subscribe(
          (result) => {
            this.listaTipoAlmacen = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onSearchAlmacen() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Nombre'){
            this.onListAlmacenesByNombre(this.searchInput);
          }
        } else {
          this.onListAlmacenes();
        }
      }

      private closeModalAlmacen(): void {
        this.modalAlmacen.nativeElement.click();
      }

      get f() {
        return this.formAlmacen.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.formAlmacen.invalid) {
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

                  this.formAlmacen.get("indVirtual").setValue('N');
                 if(this.formAlmacen.get("virtual").value == true){this.formAlmacen.get("indVirtual").setValue('S');}

                  this.almacenService.create(this.formAlmacen.value).subscribe(
                    (result) => {
                      if (result) {
                        this.onResetFormAlmacen();
                        this.onListAlmacenes();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalAlmacen();
                      } else {
                        this.closeModalAlmacen();
                      }
                    }, error => {
                      console.log(error);
                    }
                  );
            }else{

              this.formAlmacen.get("indVirtual").setValue('N');
              if(this.formAlmacen.get("virtual").value == true){this.formAlmacen.get("indVirtual").setValue('S');}

                this.almacenService.update(this.formAlmacen.value).subscribe(
                  (result) => {
                    if (result) {
                      this.onResetFormAlmacen();
                      this.onListAlmacenes();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalAlmacen();
                    } else {
                      this.closeModalAlmacen();
                    }
                  }, error => {
                    console.log(error);
                  }
                );
            }

          }
        })
      }

      onUpdateAlmacen(almacen: Almacen){
        this.accionNuevo = true;

        this.almacenService.getById(almacen.id).subscribe(
          (result) => {
            this.accionNuevo = false;
            this.formAlmacen.patchValue({

              idCompania: result.idCompania,
              id: result.id,
              nombre: result.nombre,
              tipo: result.tipo,
              direccion: result.direccion,
              indVirtual: result.indVirtual,
              idPais: result.idPais,
              estado: result.estado

            });

            /* Si indVirtual es "S", entonces this.virtual es TRUE, caso contrario false **/
 //           this.virtual=(this.formAlmacen.get("indVirtual").value == 'S')?true:false;
          if(this.formAlmacen.get("indVirtual").value == 'S'){
            this.formAlmacen.get("virtual").setValue(true);
          }else{
            this.formAlmacen.get("virtual").setValue(false);
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

      onDeleteAlmacen(almacen: Almacen){
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

            this.almacenService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),almacen.id).subscribe(
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
                  this.almacenService.delete(almacen.id).subscribe(
                    (result) => {
                      this.onListAlmacenes();
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
        this.almacenService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
          (result) => {
            const url = window.URL.createObjectURL(result);
            window.open(url);
          }, error => {
            console.log(error);
          }
        );
      }

      onExportPdf() {
        const pdfDefinition = this.almacenService.createContentFilePDF(
                                this.almacenes,
                                this.listaPaises,
                                this.listaTipoAlmacen,
                                this.listaEstados,
                                this.tokenService.getCompany());
       pdfMake.createPdf(pdfDefinition).open();

      }

}
