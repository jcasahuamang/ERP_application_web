import { Sort } from '@angular/material/sort';
import { TokenService } from '../../services/token.service';
import { Tabla } from '../../models/pages/tabla';
import { RepMaeTabla } from '../../models/pages/RepMaeTabla';
import { TablaDet } from '../../models/pages/tabladet';
import { Component, OnInit, ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TablaService } from 'src/app/services/pages/tabla.service';
import { TabladetService } from 'src/app/services/pages/tabladet.service';
import Swal from 'sweetalert2';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  public tabla: Tabla = new Tabla();
  public tablas: Tabla[];
  public tablasDet: TablaDet[];
  public repMaeTabla: RepMaeTabla[];
//  this.tablasDetArray = new TablaDet();

  public formTabla: FormGroup;
  public submitted = false;
  public submittedDet = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Tipo';


  public accionNuevo: Boolean = true;
  public idTablaActual: number;
  public tipoTablaDetActual: string = '';
  public nombreDetActual: string = '';
  //public modifiedDet = false;

  tablasCol: string[] = ['Opciones', 'TipoTabla','Nombre'];
  tablasData = new MatTableDataSource();

  @ViewChild('paginatortablas', { static: true, read: MatPaginator }) paginatortablas: MatPaginator;
  @ViewChild('closeTabla') modalTabla: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('closeTablaDet') modalTablaDet: ElementRef;

  public listaVisible: any[] = [
    {id: 'S',nombre:'Si'},
    {id: 'N',nombre:'No'}
  ];

    /*********************************** */
    displayedColumns: string[] = ['idTabla','id','codigo','nombre','valorIni','valorFin','indVisible','action'];
    dataSource = new MatTableDataSource<any>();
     isLoading = true;
     pageNumber: number = 1;
     VOForm: FormGroup;
     VOFormOriginal: FormGroup;
     isEditableNew: boolean = true;


  /****************************************/

  constructor(
    private tablaService: TablaService,
    private tabladetService: TabladetService,
    private tokenService :TokenService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarFormTabla();
    this.onListTablas();
    this.inicializarFormTablaDet();
  }


  inicializarFormTabla(): void{
    this.formTabla = this.fb.group({

      idCompania:[this.tokenService.getIdCompany(), Validators.required],
      id:[],
      tipoTabla: ['', Validators.compose([Validators.required,Validators.maxLength(15)])],
      nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      indSistema: ['N', Validators.compose([Validators.maxLength(2)])],
      sistema:[false],

     })
  }

  onResetFormTabla() {
    this.submitted = false;
    this.accionNuevo = true;
    this.formTabla.reset();
    this.formTabla.get("idCompania").setValue(this.tokenService.getIdCompany());
  }

  onListTablas() {
    this.tablaService.getByCompania(this.tokenService.getIdCompany()).subscribe(
    (result) => {
          this.tablas = result;
          this.tablasData.data = result;
          this.tablasData.paginator = this.paginatortablas;
        }, error => {
          console.log(error);
        }
      );
    }

    onListTablasByNombre(tipo: string) {
      this.tablaService.getByCompaniaTipo(this.tokenService.getIdCompany(),tipo).subscribe(
      (result) => {
            this.tablas = result;
            this.tablasData.data = result;
            this.tablasData.paginator = this.paginatortablas;
          }, error => {
            console.log(error);
          }
        );
      }

      onSearchTabla() {
        if (this.searchInput != null && this.searchInput != "") {
          if (this.selectedBusqueda == 'Tipo'){
            this.onListTablasByNombre(this.searchInput);
          }
        } else {
          this.onListTablas();
        }
      }

      private closeModalTabla(): void {
        this.modalTabla.nativeElement.click();
      }
      private closeModalTablaDet(): void {
        this.modalTablaDet.nativeElement.click();
      }

      get f() {
        return this.formTabla.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.formTabla.invalid) {
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

                  this.formTabla.get("indSistema").setValue('N');
                 if(this.formTabla.get("sistema").value == true){this.formTabla.get("indSistema").setValue('S');}

                  this.tablaService.create(this.formTabla.value).subscribe(
                    (result) => {
                      if (result) {
                        this.onResetFormTabla();
                        this.onListTablas();
                        this.changeDetectorRefs.detectChanges();
                        this.toastAcceptedAlert("Se registro con exito");
                        this.closeModalTabla();
                      } else {
                        this.closeModalTabla();
                      }
                    }, error => {
                      console.log(error);
                    }
                  );
            }else{

              this.formTabla.get("indSistema").setValue('N');
              if(this.formTabla.get("sistema").value == true){this.formTabla.get("indSistema").setValue('S');}

                this.tablaService.update(this.formTabla.value).subscribe(
                  (result) => {
                    if (result) {
                      this.onResetFormTabla();
                      this.onListTablas();
                      this.changeDetectorRefs.detectChanges();
                      this.toastAcceptedAlert("Se registro con exito");
                      this.closeModalTabla();
                    } else {
                      this.closeModalTabla();
                    }
                  }, error => {
                    console.log(error);
                  }
                );
            }

          }
        })
      }

      onUpdateTabla(tabla: Tabla){
        this.accionNuevo = true;

        this.tablaService.getById(tabla.id).subscribe(
          (result) => {
            this.accionNuevo = false;
            this.formTabla.patchValue({

              idCompania: result.idCompania,
              id: result.id,
              tipoTabla: result.tipoTabla,
              nombre: result.nombre,
              indSistema: result.indSistema

            });

            /* Si indVirtual es "S", entonces this.virtual es TRUE, caso contrario false **/
 //           this.virtual=(this.formAlmacen.get("indVirtual").value == 'S')?true:false;
          if(this.formTabla.get("indSistema").value == 'S'){
            this.formTabla.get("sistema").setValue(true);
          }else{
            this.formTabla.get("sistema").setValue(false);
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



      onDeleteTabla(tabla: Tabla){
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

          // this.tablaService.delete(compania.id).subscribe(
            this.tablaService.delete(this.tokenService.getUserName(),this.tokenService.getIdClient(),tabla.id).subscribe(
            (result) => {
              this.onListTablas();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se Elimino con exito");
              }, error => {
                console.log(error);
              }
            )
          }
        }
        )

      }

  /***************  TABLA DETALLE *********************************************/

  inicializarFormTablaDet(): void{

    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([
        this.fb.group({

          idTabla: ['',Validators.required],
          id: [],
          codigo: ['', Validators.compose([Validators.required,Validators.maxLength(5)])],
          nombre: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
          valorIni: [],
          valorFin: [],
          indVisible: ['S', Validators.compose([Validators.maxLength(2)])],
          action: new FormControl('existingRecord'),
          isEditable: new FormControl(true),
          isNewRow: new FormControl(false),
          isModified: new FormControl(false),

          })
      ])
    });

      this.VOFormOriginal = this.VOForm;
  }


  onUpdateTablaDet(tabla){
    this.idTablaActual = tabla.id;
    this.tipoTablaDetActual= tabla.tipoTabla;
    this.nombreDetActual= tabla.nombre;
    this.submittedDet = false;
    //this.modifiedDet = false;

    this.tabladetService.getByTabla(tabla.id).subscribe(
      (result) => {
            this.tablasDet = result;

            this.VOForm = this.fb.group({
              VORows: this.fb.array(
                this.tablasDet.map(val => this.fb.group({
                idTabla: new FormControl(val.idTabla),
                id: new FormControl(val.id),
                codigo: new FormControl(val.codigo),
                nombre: new FormControl(val.nombre),
                valorIni: new FormControl(val.valorIni),
                valorFin: new FormControl(val.valorFin),
                indVisible: new FormControl(val.indVisible),
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
                isModified: new FormControl(false),
              }))
              ) //end of fb array
            }); // end of form group cretation


            this.VOFormOriginal = this.fb.group({
              VORows: this.fb.array(
                this.tablasDet.map(val => this.fb.group({
                idTabla: new FormControl(val.idTabla),
                id: new FormControl(val.id),
                codigo: new FormControl(val.codigo),
                nombre: new FormControl(val.nombre),
                valorIni: new FormControl(val.valorIni),
                valorFin: new FormControl(val.valorFin),
                indVisible: new FormControl(val.indVisible),
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
                isModified: new FormControl(false),
              }))
              ) //end of fb array
            }); // end of form group cretation


            this.isLoading = false;
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

  }


  GetDetArrayDelete<T>()
  {
     let deleted = [];
    this.VOFormOriginal.value.VORows.forEach(element =>
      {
        const DetFound = this.VOForm.value.VORows.find((obj) => {return obj.id === element.id;  });
        if(!DetFound)  //Si esta en Original pero no en el normal, significa que fue eliminado
        {
          deleted.push(
            {idTabla: element.idTabla,
            id: element.id,
            codigo: element.codigo,
            nombre: element.nombre,
            valorIni: element.valorIni,
            valorFin: element.valorFin,
            indVisible: element.indVisible}
          );
        }

      });

      return deleted;
  }


  GetDetArrayUpdate<T>()
  {
    let ArrayUpdate = [];

    this.VOForm.value.VORows.forEach(element => {
      ArrayUpdate.push(
        {idTabla: element.idTabla,
        id: element.id,
        codigo: element.codigo,
        nombre: element.nombre,
        valorIni: element.valorIni,
        valorFin: element.valorFin,
        indVisible: element.indVisible}
      );
    });

    return ArrayUpdate;
  }

  GetNumberoEmptyCodigo<T>()
  {
    let numeroVacio : number = 0;

    this.VOForm.value.VORows.forEach(element => {
            if(element.codigo == null || element.codigo == '')
            { numeroVacio++;}
          });
    return numeroVacio;
  }

 GetNumberoDuplicadosArray<T>()
 {
    let original = [];
    this.VOForm.value.VORows.forEach(element => {original.push(element.codigo);});

    const notduplicated: T[] = [];
    const duplicated: T[] = [];

    original.forEach((item) => {
          if (!notduplicated.includes(item))
          {notduplicated.push(item);
          }else{
            if (!duplicated.includes(item))
            {duplicated.push(item);}
          }
      })
      return duplicated.length;
}


  onSubmitDet() {
  /*
  console.log("modificated");
  console.log(this.VOForm.get('VORows'));
  console.log("Original");
  console.log(this.VOFormOriginal.get('VORows'));
  */

/*    if(!this.modifiedDet){
      Swal.fire('Validacion','No ha realizado ninguna modificación!','warning');
      return;
    }
*/

    if(this.GetNumberoEmptyCodigo() > 0){
      Swal.fire('Validacion','Existen registros sin código, verificar!','warning');
       return;
    }


    if(this.GetNumberoDuplicadosArray() > 0){
      Swal.fire('Validacion','Existen registros con código duplicado, verificar!','warning');
       return;
    }

    /*** Insert - Modifica *********************/
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

                this.tabladetService.saveAll(this.GetDetArrayUpdate()).subscribe(
                  (result) => {
                    if (result) {

                         if (this.GetDetArrayDelete())  //si existen eliminados
                         {

                            this.tabladetService.deleteAll(this.GetDetArrayDelete()).subscribe(
                              (result) => {
                                  this.submittedDet = true;
                                  this.changeDetectorRefs.detectChanges();
                                  this.toastAcceptedAlert("Se registro con exito");
                                  this.closeModalTablaDet();
                                }, error => {
                                  console.log(error);
                                }
                              )

                         }
                         else{
                            this.submittedDet = true;
                            this.changeDetectorRefs.detectChanges();
                            this.toastAcceptedAlert("Se registro con exito");
                            this.closeModalTablaDet();
                        }

                    } else {
                      this.closeModalTablaDet();
                    }

                  }, error => {
                    console.log(error);
                  }


                );
        }
      })

  }

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');

   this.onPaginateChange(this.paginator, this.paginatorList);

   this.paginator.page.subscribe(() => { // this is page change event
     this.onPaginateChange(this.paginator, this.paginatorList);
   });
  }

   applyFilter(event: Event) {
    //  debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // @ViewChild('table') table: MatTable<PeriodicElement>;
  AddNewRow() {
    // this.getBasicDetails();
    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0,this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls)
    //VOFormElement.get('VORows').at(i).get('isEditable').patchValue(idTablaActual);

    // control.controls.unshift(this.initiateVOForm());
    // this.openPanel(panel);
      // this.table.renderRows();
      // this.dataSource.data = this.dataSource.data;
//      this.modifiedDet = true;
  }

  DeleteVO(i) {
    const control = this.VOForm.get('VORows') as FormArray;
    control.removeAt(i);
    this.dataSource = new MatTableDataSource(control.controls)
  }

/*
  // this function will enabled the select field for editd
  EditSVO(VOFormElement, i) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    VOFormElement.get('VORows').at(i).get('isModified').patchValue(true);
    this.modifiedDet = true;
    // this.isEditableNew = true;
  }


  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement, i) {
    // alert('SaveVO')
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.modifiedDet = true;
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.modifiedDet = true;
  }
*/

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

                idTabla: new FormControl(this.idTablaActual),
                id: new FormControl(null),
                codigo: new FormControl(''),
                nombre: new FormControl(''),
                valorIni: new FormControl(null),
                valorFin: new FormControl(null),
                indVisible: new FormControl('S'),
                action: new FormControl('newRecord'),
                isEditable: new FormControl(false),
                isNewRow: new FormControl(true),
                isModified: new FormControl(true),
    });
  }

  onExportExcel(){
    this.tablaService.getFileExcelByCompania(this.tokenService.getIdCompany()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onExportPdf() {

    this.tablaService.getListByCompaniaPDF(this.tokenService.getIdCompany()).subscribe(
      (result) => {
            this.repMaeTabla = result;
            const pdfDefinition = this.tablaService.createContentFilePDF(this.repMaeTabla,this.tokenService.getCompany());
            pdfMake.createPdf(pdfDefinition).open();

          }, error => {
            console.log(error);
          }
        );

  }
}
