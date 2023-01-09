import { Compania } from './../../models/pages/compania';
import { CompaniaService } from 'src/app/services/pages/compania.service';
import { TokenService } from './../../services/token.service';
import { Component, OnInit,ChangeDetectorRef,ElementRef,ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public compania: Compania = new Compania();

  public companias: Compania[];
  public formCompania: FormGroup;
  public submitted = false;
  public nomCompania: string = "";


  @ViewChild('closeCompania') modalCompania: ElementRef;

  constructor(
    private tokenService: TokenService,
    private companiaService:CompaniaService,
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.inicializarFormCompania();
    this.nomCompania = this.tokenService.getCompany();
  }

  onLogOut():void{
    this.tokenService.logOut();
/*    window.location.reload();*/
    swal.fire('Logout','Ha cerrado la sesion con exito!','success');
    this.router.navigate(['login']);
  }
  get f() {
    return this.formCompania.controls;
  }

  onSetupEmpresa():void{
    this.onListCompanias();
    this.formCompania.reset();
    this.formCompania.get("id").setValue(this.tokenService.getIdCompany());

    this.formCompania.patchValue({id: this.tokenService.getIdCompany() });

  }

  onResetFormCompania() {
    this.submitted = false;
    this.formCompania.reset();
    this.formCompania.get("id").setValue(this.tokenService.getIdCompany());
}

  onListCompanias():void{
    this.companiaService.getByCliente(this.tokenService.getIdClient()).subscribe(
      (result) => {
            this.companias = result;
          }, error => {
            console.log(error);
          }
        );

  }

  inicializarFormCompania(): void{
    this.formCompania = this.fb.group({
      id:[,Validators.required],
     })

  }

  private closeModalCompania(): void {
    this.modalCompania.nativeElement.click();
  }

  onRefrescarPaginaActual(){
     this.router.routeReuseStrategy.shouldReuseRoute = ()=> false;
      this.router.onSameUrlNavigation = 'reload';
//      this.router.onSameUrlNavigation = 'ignore';
//    this.router.navigate(['./'],{relativeTo:this.activedRoute,queryParamsHandling:"merge"})
//    this.router.navigate([this.router.url],{relativeTo:this.activedRoute,queryParamsHandling:"merge"})
      //this.router.navigate([this.router.url],{relativeTo:this.activedRoute,queryParamsHandling:"merge"})
      //this.router.navigate([this.router.url]);
      this.router.navigateByUrl(this.router.url, {skipLocationChange: true}).then(() => {
        this.router.navigate([this.router.url]);
    });


  }

  onSubmit(){
    this.submitted = true;
    if (this.formCompania.invalid) {
      return;
    }
    this.companiaService.getById(this.formCompania.get("id").value).subscribe(
      (result) => {
        this.compania = result;
        this.tokenService.setIdCompany(this.compania.id);
        this.tokenService.setCompany(this.compania.nombreComercial);
        this.tokenService.setIdPaisCompany(this.compania.idPais);
        this.tokenService.setIdEstadoCompany(this.compania.estado);

        this.nomCompania = this.compania.nombreComercial;
        this.onResetFormCompania();
        this.closeModalCompania();
        this.changeDetectorRefs.detectChanges();

//        this.nomCompania = this.tokenService.getCompany();
         this.onRefrescarPaginaActual();
        }, error => {
          console.log(error);
        }
      );

  }

}
