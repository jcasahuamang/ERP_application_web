import { PaisService } from './../../services/pais.service';
import { Pais } from './../../models/pais';
import { TokenService } from './../../services/token.service';
import { Sede } from './../../models/pages/sede';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SedeService } from 'src/app/services/pages/sede.service';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {

  public sede: Sede = new Sede();
  public sedes: Sede[];

  public formSede: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public listaPaises: Pais[];
  public listaEstados: any[];

  public accionNuevo: Boolean = true;

  sedesCol: string[] = ['Opciones', 'Nombre','Direccion','Telefono1','Telefono2','Estado'];
  sedesData = new MatTableDataSource();

  @ViewChild('paginatorsedes', { static: true, read: MatPaginator }) paginatorsedes: MatPaginator;
  @ViewChild('closeSede') modalSede: ElementRef;

  constructor(private sedeService: SedeService,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inicializarFormSede();
    this.onListSedes();
    this.onListPaises();
    this.onListEstados();
  }

  inicializarFormSede(): void{
    this.formSede = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      direccion: ['', Validators.compose([Validators.maxLength(250)])],
      telefono1: ['', Validators.compose([Validators.maxLength(50)])],
      telefono2: ['', Validators.compose([Validators.maxLength(50)])],
      idPais:[this.tokenService.getIdPaisCompany(), Validators.required],
      estado:[1, Validators.required],

     })
  }

  onResetFormSede() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formSede.reset();
    this.formSede.get("idCompania").setValue(this.tokenService.getIdCompany());
    this.formSede.get("idPais").setValue(this.tokenService.getIdPaisCompany());
    this.formSede.get("estado").setValue(1);
  }

  onListSedes() {
    this.sedeService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.sedes = result;
          this.sedesData.data = result;
          this.sedesData.paginator = this.paginatorsedes;
        }, error => {
          console.log(error);
        }
      );
    }

    onListSedesByNombre(nombre: string) {
      this.sedeService.getByCompaniaNombre(this.tokenService.getIdCompany(),nombre).subscribe(
      (result) => {
            this.sedes = result;
            this.sedesData.data = result;
            this.sedesData.paginator = this.paginatorsedes;
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

      onSearchSede() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Nombre'){
            this.onListSedesByNombre(this.searchInput);
          }
        } else {
          this.onListSedes();
        }
      }

      private closeModalSede(): void {
        this.modalSede.nativeElement.click();
      }

      get f() {
        return this.formSede.controls;
      }


      onSubmit() {
        this.submitted = true;
        if (this.formSede.invalid) {
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
                  this.sedeService.create(this.formSede.value).subscribe(
                    (result) => {
                      if (result) {
                        this.onResetFormSede();
                        this.onListSedes();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalSede();
                      } else {
                        this.closeModalSede();
                      }
                    }, error => {
                      console.log(error);
                    }
                  );
            }else{

                this.sedeService.update(this.formSede.value).subscribe(
                  (result) => {
                    if (result) {
                      this.onResetFormSede();
                      this.onListSedes();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalSede();
                    } else {
                      this.closeModalSede();
                    }
                  }, error => {
                    console.log(error);
                  }
                );
            }

          }
        })
      }


  onUpdateSede(sede: Sede){
    this.accionNuevo = true;

    this.sedeService.getById(sede.id).subscribe(
      (result) => {
        this.accionNuevo = false;
        this.formSede.patchValue({

          idCompania: result.idCompania,
          id: result.id,
          nombre: result.nombre,
          direccion: result.direccion,
          telefono1: result.telefono1,
          telefono2: result.telefono2,
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


  onDeleteSede(sede: Sede){
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

        this.sedeService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),sede.id).subscribe(
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
              this.sedeService.delete(sede.id).subscribe(
                (result) => {
                  this.onListSedes();
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
    this.sedeService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

   onExportPdf() {

    const pdfDefinition = this.sedeService.createContentFilePDF(
                            this.sedes,
                            this.listaPaises,
                            this.listaEstados,
                            this.tokenService.getCompany());
   pdfMake.createPdf(pdfDefinition).open();


  }

}
