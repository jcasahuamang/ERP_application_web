
import { PaisService } from './../../services/pais.service';
import { Pais } from './../../models/pais';
import { TokenService } from './../../services/token.service';
import { Entidad } from './../../models/pages/entidad';
import { EntidadContacto } from './../../models/pages/entidadcontacto';
import { EntidadTipo } from 'src/app/models/pages/entidadtipo';
import { RepMaeEntidad } from './../../models/pages/RepMaeEntidad';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EntidadService } from './../../services/pages/entidad.service';
import { EntidadcontactoService } from './../../services/pages/entidadcontacto.service';
import { EntidadtipoService } from 'src/app/services/pages/entidadtipo.service';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { TabladetService } from 'src/app/services/pages/tabladet.service';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { TablaDet } from 'src/app/models/pages/tabladet';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-auxiliar',
  templateUrl: './auxiliar.component.html',
  styleUrls: ['./auxiliar.component.css']
})
export class AuxiliarComponent implements OnInit {

  public entidad: Entidad = new Entidad();
  public entidades: Entidad[];
  public entidadesContacto: EntidadContacto[];
  public entidadesTipo: EntidadTipo[];
  public repMaeEntidad: RepMaeEntidad[];

  public formEntidad: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public listaPaises: Pais[];
  public listaEstados: any[];
  public listaTipoDoc: TablaDet[];
  public listaTipoEntidad: TablaDet[];

  public accionNuevo: Boolean = true;
  public idEntidadForm: number;

  entidadesCol: string[] = ['Opciones', 'Nombre Legal','Nombre Comercial','Num. Doc.','WebPage','Email','Telefono1','Estado'];
  entidadesData = new MatTableDataSource();

  @ViewChild('paginatorentidades', { static: true, read: MatPaginator }) paginatorentidades: MatPaginator;
  @ViewChild('closeEntidad') modalEntidad: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatPaginator) paginatorTipo: MatPaginator;

      /*********************************** */
      displayedColumns: string[] = ['action','Nombre','telefono1','email','cargo'];
      dataSource = new MatTableDataSource<any>();
       pageNumber: number = 1;
       VOForm: FormGroup;
       VOFormOriginal: FormGroup;
       isEditableNew: boolean = true;

    /*********************************** */
    entidadesTiposColumns: string[] = ['action','Tipo'];
    entidadesTiposData = new MatTableDataSource<any>();
     pageNumberTipo: number = 1;
     VOFormTipo: FormGroup;
     VOFormOriginalTipo: FormGroup;
     isEditableNewTipo: boolean = true;

    /****************************************/

  constructor(private entidadService: EntidadService,
    private entidadContactoService: EntidadcontactoService,
    private entidadTipoService: EntidadtipoService,
    private paisService: PaisService,
    private estadoService: EstadoService,
    private tabladetService: TabladetService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private _formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.inicializarFormEntidad();
    this.onListEntidades();
    this.onListPaises();
    this.onListEstados();
    this.onListTipoDoc();
    this.onListTipoEntidad();
    this.inicializarFormEntidadContacto();
    this.inicializarFormEntidadTipo();
  }

  inicializarFormEntidad(): void{
    this.formEntidad = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      nombrePrimero: ['', Validators.compose([Validators.maxLength(50)])],
      nombreSegundo: ['', Validators.compose([Validators.maxLength(50)])],
      apellidoPaterno: ['', Validators.compose([Validators.maxLength(50)])],
      apellidoMaterno: ['', Validators.compose([Validators.maxLength(50)])],
      nombreLegal: ['', Validators.compose([Validators.maxLength(250)])],
      nombreComercial: ['', Validators.compose([Validators.maxLength(250)])],
      tipoDocumento: ['', Validators.compose([Validators.required,Validators.maxLength(5)])],
      numeroDocumento: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
      webpage: ['', Validators.compose([Validators.maxLength(250)])],
      email: ['', Validators.compose([Validators.maxLength(250)])],
      telefono1: ['', Validators.compose([Validators.maxLength(50)])],
      telefono2: ['', Validators.compose([Validators.maxLength(50)])],
      codigoHabido: ['', Validators.compose([Validators.maxLength(5)])],
      idPais:[this.tokenService.getIdPaisCompany(), Validators.required],
      estado:[1, Validators.required],

     })
  }

  onResetFormEntidad() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formEntidad.reset();
    this.formEntidad.get("idCompania").setValue(this.tokenService.getIdCompany());
    this.formEntidad.get("idPais").setValue(this.tokenService.getIdPaisCompany());
    this.formEntidad.get("estado").setValue(1);
  }

  onListEntidades() {
    this.entidadService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.entidades = result;
          this.entidadesData.data = result;
          this.entidadesData.paginator = this.paginatorentidades;
        }, error => {
          console.log(error);
        }
      );
    }

    onListEntidadesByNombre(nombre: string) {
      this.entidadService.getByCompaniaNombre(this.tokenService.getIdCompany(),nombre).subscribe(
      (result) => {
            this.entidades = result;
            this.entidadesData.data = result;
            this.entidadesData.paginator = this.paginatorentidades;
          }, error => {
            console.log(error);
          }
        );
      }

      onListPaises() {
        this.paisService.getAll().subscribe(
          (result) => {
            this.listaPaises = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onListEstados() {
        this.listaEstados = this.estadoService.estado;
      }

      onListTipoDoc() {
        this.tabladetService.getByCompaniaTipo(this.tokenService.getIdCompany(),'SIS_TDOCENT').subscribe(
          (result) => {
            this.listaTipoDoc = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onListTipoEntidad() {
        this.tabladetService.getByCompaniaTipo(this.tokenService.getIdCompany(),'SIS_TIPENT').subscribe(
          (result) => {
            this.listaTipoEntidad = result;
          }, error => {
            console.log(error);
          }
        );
      }

      onSearchEntidad() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Nombre'){
            this.onListEntidadesByNombre(this.searchInput);
          }
        } else {
          this.onListEntidades();
        }
      }

      private closeModalEntidad(): void {
        this.modalEntidad.nativeElement.click();
      }

      get f() {
        return this.formEntidad.controls;
      }



      onUpdateEntidad(entidad: Entidad){
        this.accionNuevo = true;
//    this.idEntidadForm = this.formEntidad.get("id").value;
      this.idEntidadForm = entidad.id;
      this.entidadService.getById(entidad.id).subscribe(
          (result) => {
            this.accionNuevo = false;
            this.formEntidad.patchValue({
              idCompania: result.idCompania,
              id: result.id,
              nombrePrimero: result.nombrePrimero,
              nombreSegundo: result.nombreSegundo,
              apellidoPaterno: result.apellidoPaterno,
              apellidoMaterno: result.apellidoMaterno,
              nombreLegal: result.nombreLegal,
              nombreComercial: result.nombreComercial,
              tipoDocumento: result.tipoDocumento,
              numeroDocumento: result.numeroDocumento,
              webpage: result.webpage,
              email: result.email,
              telefono1: result.telefono1,
              telefono2: result.telefono2,
              codigoHabido: result.codigoHabido,
              idPais: result.idPais,
              estado: result.estado
            });

            }, error => {
              console.log(error);
            }
          );


          this.entidadContactoService.getByEntidad(entidad.id).subscribe(
            (result) => {
                  this.entidadesContacto = result;

                  this.VOForm = this.fb.group({
                    VORows: this.fb.array(
                      this.entidadesContacto.map(val => this.fb.group({
                        idEntidad: new FormControl(val.idEntidad),
                        id: new FormControl(val.id),
                        nombreCompleto: new FormControl(val.nombreCompleto),
                        telefono1: new FormControl(val.telefono1),
                        email: new FormControl(val.email),
                        cargo: new FormControl(val.cargo),
                        action: new FormControl('existingRecord'),
                        isEditable: new FormControl(true),
                        isNewRow: new FormControl(false),
                        isModified: new FormControl(false),
                    }))
                    ) //end of fb array
                  }); // end of form group cretation


                  this.VOFormOriginal = this.fb.group({
                    VORows: this.fb.array(
                      this.entidadesContacto.map(val => this.fb.group({
                        idEntidad: new FormControl(val.idEntidad),
                        id: new FormControl(val.id),
                        nombreCompleto: new FormControl(val.nombreCompleto),
                        telefono1: new FormControl(val.telefono1),
                        email: new FormControl(val.email),
                        cargo: new FormControl(val.cargo),
                        action: new FormControl('existingRecord'),
                        isEditable: new FormControl(true),
                        isNewRow: new FormControl(false),
                        isModified: new FormControl(false),
                    }))
                    ) //end of fb array
                  }); // end of form group cretation

                  this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
                  this.dataSource.paginator = this.paginator;

                  const filterPredicate = this.dataSource.filterPredicate;
                    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
                      return filterPredicate.call(this.dataSource, data.value, filter);
                    }

                }, error => {
                  console.log(error);
                }
              );


              this.entidadTipoService.getByEntidad(entidad.id).subscribe(
                (result) => {
                      this.entidadesTipo = result;
//                      console.log("result");
//                      console.log(result);
                      this.VOFormTipo = this.fb.group({
                        VORows: this.fb.array(
                          this.entidadesTipo.map(val => this.fb.group({
                            idEntidad: new FormControl(val.idEntidad),
                            id: new FormControl(val.id),
                            codigo: new FormControl(val.codigo),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                            isModified: new FormControl(false),
                        }))
                        ) //end of fb array
                      }); // end of form group cretation

                      this.VOFormOriginalTipo = this.fb.group({
                        VORows: this.fb.array(
                          this.entidadesTipo.map(val => this.fb.group({
                            idEntidad: new FormControl(val.idEntidad),
                            id: new FormControl(val.id),
                            codigo: new FormControl(val.codigo),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                            isModified: new FormControl(false),
                        }))
                        ) //end of fb array
                      }); // end of form group cretation


                      this.entidadesTiposData = new MatTableDataSource((this.VOFormTipo.get('VORows') as FormArray).controls);
                      this.entidadesTiposData.paginator = this.paginatorTipo;

                      const filterPredicate = this.entidadesTiposData.filterPredicate;
                        this.entidadesTiposData.filterPredicate = (data: AbstractControl, filter) => {
                          return filterPredicate.call(this.entidadesTiposData, data.value, filter);
                        }

                    }, error => {
                      console.log(error);
                    }
                  );

/*
                  console.log("entidadTipoService");
                  console.log(this.VOFormTipo.get('VORows'));

                  console.log("listaTipoEntidad");
                  console.log(this.listaTipoEntidad);
*/

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


      onDeleteEntidad(entidad: Entidad){
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

            this.entidadService.getValidaDelete(this.tokenService.getUserName(),this.tokenService.getIdClient(),entidad.id).subscribe(
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
                    this.entidadService.delete(this.tokenService.getUserName(),this.tokenService.getIdClient(),entidad.id).subscribe(
                    (result) => {
                      this.onListEntidades();
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

  /***************  DETALLE CONTACTO *********************************************/

  inicializarFormEntidadContacto(): void{

    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([
        this.fb.group({

          idEntidad: ['',Validators.required],
          id: [],
          nombreCompleto: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
          telefono1: ['', Validators.compose([Validators.maxLength(50)])],
          email: ['', Validators.compose([Validators.maxLength(250)])],
          cargo: ['', Validators.compose([Validators.maxLength(250)])],
          action: new FormControl('existingRecord'),
          isEditable: new FormControl(true),
          isNewRow: new FormControl(false),
          isModified: new FormControl(false),

          })
      ])
    });

      this.VOFormOriginal = this.VOForm;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');

   this.onPaginateChange(this.paginator, this.paginatorList);

   this.paginator.page.subscribe(() => { // this is page change event
     this.onPaginateChange(this.paginator, this.paginatorList);
   });
  }


  AddNewRow() {
    // this.getBasicDetails();
    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0,this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls)
  }

  DeleteVO(i) {
    const control = this.VOForm.get('VORows') as FormArray;
    control.removeAt(i);
    this.dataSource = new MatTableDataSource(control.controls)
  }

  paginatorList: HTMLCollectionOf<Element>;
  idx: number;
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
       setTimeout((idx) => {
           let from = (paginator.pageSize * paginator.pageIndex) + 1;

           let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
               ? paginator.length
               : paginator.pageSize * (paginator.pageIndex + 1);

           let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
           let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
           let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

           if (list.length >= 1)
               list[0].innerHTML = rows;

       }, 0, paginator.pageIndex);
  }


  initiateVOForm(): FormGroup {
    return this.fb.group({

                idEntidad: new FormControl(null),
                id: new FormControl(null),
                nombreCompleto: new FormControl(null),
                telefono1: new FormControl(null),
                email: new FormControl(null),
                cargo: new FormControl(null),
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
                isModified: new FormControl(false),

    });
  }
/**********************************************/
  /***************  DETALLE TIPO *********************************************/

  inicializarFormEntidadTipo(): void{

    this.VOFormTipo = this._formBuilder.group({
      VORows: this._formBuilder.array([
        this.fb.group({

          idEntidad: ['',Validators.required],
          id: [],
          codigo: ['', Validators.compose([Validators.required,Validators.maxLength(5)])],
          action: new FormControl('existingRecord'),
          isEditable: new FormControl(true),
          isNewRow: new FormControl(false),
          isModified: new FormControl(false),

          })
      ])
    });

      this.VOFormOriginalTipo = this.VOFormTipo;
  }

  ngAfterViewInitTipo() {
    this.entidadesTiposData.paginator = this.paginatorTipo;
    this.paginatorListTipo = document.getElementsByClassName('mat-paginator-range-label');

   this.onPaginateChangeTipo(this.paginatorTipo, this.paginatorListTipo);

   this.paginatorTipo.page.subscribe(() => { // this is page change event
     this.onPaginateChangeTipo(this.paginatorTipo, this.paginatorListTipo);
   });
  }


  AddNewRowTipo() {
    const control = this.VOFormTipo.get('VORows') as FormArray;
    control.insert(0,this.initiateVOFormTipo());
    this.entidadesTiposData = new MatTableDataSource(control.controls)
  }

  DeleteVOTipo(i) {
    const control = this.VOFormTipo.get('VORows') as FormArray;
    control.removeAt(i);
    this.entidadesTiposData = new MatTableDataSource(control.controls)
  }

  paginatorListTipo: HTMLCollectionOf<Element>;
  idxTipo: number;
  onPaginateChangeTipo(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
       setTimeout((idxTipo) => {
           let from = (paginator.pageSize * paginator.pageIndex) + 1;

           let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
               ? paginator.length
               : paginator.pageSize * (paginator.pageIndex + 1);

           let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
           let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
           let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

           if (list.length >= 1)
               list[0].innerHTML = rows;

       }, 0, paginator.pageIndex);
  }

  initiateVOFormTipo(): FormGroup {
    return this.fb.group({

                idEntidad: new FormControl(null),
                id: new FormControl(null),
                codigo: new FormControl(null),
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
                isModified: new FormControl(false),

    });
  }

/****************************************************/

GetDetArrayContacto<T>()
{  let Array = [];

  this.VOForm.value.VORows.forEach(element => {
    Array.push(
      {idEntidad: this.idEntidadForm,
      id: element.id,
      nombreCompleto: element.nombreCompleto,
      telefono1: element.telefono1,
      email: element.email,
      cargo: element.cargo}
    );
  });
  return Array;
}

GetDetArrayContactoDelete<T>()
{
   let deleted = [];
  this.VOFormOriginal.value.VORows.forEach(element =>
    {
      const DetFound = this.VOForm.value.VORows.find((obj) => {return obj.id === element.id;  });
      if(!DetFound)  //Si esta en Original pero no en el normal, significa que fue eliminado
      {
        deleted.push(
          {idEntidad: element.idEntidad,
            id: element.id,
            nombreCompleto: element.nombreCompleto,
            telefono1: element.telefono1,
            email: element.email,
            cargo: element.cargo}
        );
      }

    });

    return deleted;
}


GetDetArrayTipo<T>()
{  let Array = [];
  this.VOFormTipo.value.VORows.forEach(element => {
    Array.push(
      {idEntidad: this.idEntidadForm,
      id: element.id,
      codigo: element.codigo}
    );
  });
  return Array;
}

GetDetArrayTipoDelete<T>()
{
   let deleted = [];
  this.VOFormOriginalTipo.value.VORows.forEach(element =>
    {
      const DetFound = this.VOFormTipo.value.VORows.find((obj) => {return obj.id === element.id;  });
      if(!DetFound)  //Si esta en Original pero no en el normal, significa que fue eliminado
      {
        deleted.push(
          {idEntidad: element.idEntidad,
            id: element.id,
            codigo: element.codigo}
        );
      }

    });

    return deleted;
}

onSubmit() {
  this.submitted = true;
  let submitContacto: Boolean = true;
  let submitTipo: Boolean = true;
  if (this.formEntidad.invalid) {
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

            this.entidadService.create(this.formEntidad.value).subscribe(
              (result) => {
                if (result) {
                  this.idEntidadForm = result.id;

                  if (this.GetDetArrayContacto() || this.GetDetArrayTipo())  //si existen contactos or Tipos
                  {
                    if (this.GetDetArrayContacto())
                    {
                      this.entidadContactoService.saveAll(this.GetDetArrayContacto()).subscribe(
                        (result) => {
                          }, error => {
                           submitContacto = false;
                           console.log(error);
                          }
                        )
                    }

                    if (this.GetDetArrayTipo())
                    {
                      this.entidadTipoService.saveAll(this.GetDetArrayTipo()).subscribe(
                        (result) => {
                          }, error => {
                            submitTipo = false;
                            console.log(error);
                          }
                        )
                    }

                    if (submitContacto && submitTipo )
                    {
                      this.onResetFormEntidad();
                      this.onListEntidades();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalEntidad();
                    }

                  }
                  else{
                    this.onResetFormEntidad();
                    this.onListEntidades();
                    this.changeDetectorRefs.detectChanges();
                    this.toastAcceptedAlert("Se registro con exito");
                    this.closeModalEntidad();
                 }

                } else {
                  this.closeModalEntidad();
                }
              }, error => {
                console.log(error);
              }

            );
      }else{

        this.entidadService.update(this.formEntidad.value).subscribe(
            (result) => {
              if (result) {
                   //si existen contactos or Tipos
                  if (this.GetDetArrayContacto() || this.GetDetArrayTipo() || this.GetDetArrayContactoDelete()|| this.GetDetArrayTipoDelete())
                  {
                      if (this.GetDetArrayContacto())
                      {
                        this.entidadContactoService.saveAll(this.GetDetArrayContacto()).subscribe(
                          (result) => {
                            }, error => {
                             submitContacto = false;
                             console.log(error);
                            }
                          )
                      }

                      if (this.GetDetArrayTipo())
                      {
                        this.entidadTipoService.saveAll(this.GetDetArrayTipo()).subscribe(
                          (result) => {
                            }, error => {
                              submitTipo = false;
                              console.log(error);
                            }
                          )
                      }

                      if (this.GetDetArrayContactoDelete())
                      {
                        this.entidadContactoService.deleteAll(this.GetDetArrayContactoDelete()).subscribe(
                          (result) => {
                            }, error => {
                             submitContacto = false;
                             console.log(error);
                            }
                          )
                      }

                      if (this.GetDetArrayTipoDelete())
                      {
                        this.entidadTipoService.deleteAll(this.GetDetArrayTipoDelete()).subscribe(
                          (result) => {
                            }, error => {
                              submitTipo = false;
                              console.log(error);
                            }
                          )
                      }

                      if (submitContacto && submitTipo )
                      {
                        this.onResetFormEntidad();
                        this.onListEntidades();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalEntidad();
                      }

                  }
                  else{
                    this.onResetFormEntidad();
                    this.onListEntidades();
                    this.changeDetectorRefs.detectChanges();
                    this.toastAcceptedAlert("Se registro con exito");
                    this.closeModalEntidad();
                 }


              } else {
                this.closeModalEntidad();
              }
            }, error => {
              console.log(error);
            }
          );
      }

    }
  })
}



      onExportExcel() {

        this.entidadService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
          (result) => {
            const url = window.URL.createObjectURL(result);
            window.open(url);
          }, error => {
            console.log(error);
          }
        );

      }


      onExportPdf() {

        this.entidadService.getListByCompaniaPDF(this.tokenService.getIdCompany()).subscribe(
          (result) => {
                this.repMaeEntidad = result;
                const pdfDefinition = this.entidadService.createContentFilePDF(this.repMaeEntidad,this.tokenService.getCompany());
                pdfMake.createPdf(pdfDefinition).open();

              }, error => {
                console.log(error);
              }
            );

      }


}
