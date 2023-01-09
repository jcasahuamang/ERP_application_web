import { EmailRequest } from './../../models/emailrequest';
import { Pais } from './../../models/pais';
import { Plan } from './../../models/plan';
import { Sistema } from './../../models/sistema';


import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Component, OnInit } from '@angular/core';
import{FormGroup, FormBuilder, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from 'src/app/services/pais.service';
import { PlanService } from 'src/app/services/plan.service';
import { SistemaService } from 'src/app/services/sistema.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit {
  cliente: Cliente = new Cliente();
  emailRequest: EmailRequest = new EmailRequest();

  public registerForm: FormGroup;

  public paises: Pais[];
  public planes: Plan[];
  public sistemas: Sistema[];

  constructor(private clienteService:ClienteService,
    private paisService: PaisService,
    private planService: PlanService,
    private sistemaService: SistemaService,
    private emailService:EmailService,
    private router: Router,private activateRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListaPaises();
    this.ListaPlanes();
    this.ListaSistemas();
  }

  inicializarForm(): void{
    this.registerForm = this.fb.group({
      usuario: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.email,Validators.required])],
      primerNombre: ['', Validators.compose([Validators.maxLength(250)])],
      segundoNombre: ['', Validators.compose([Validators.maxLength(250)])],
      apellidos: ['', Validators.compose([Validators.maxLength(250)])],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      pais:[8, Validators.required],
      estado:0,
      plan:[, Validators.required],
      sistema:[, Validators.required],
     })


  }

  public create(): void{
//    console.log(this.registerForm.value);
    if (this.registerForm.get('password').value != this.registerForm.get('repassword').value){
      swal.fire('Nuevo Cliente','La contraseña ingresada no coindice con la confirmación, verifique!','error');
    }else{
      this.cliente.usuario  =    this.registerForm.get('usuario').value;
      this.cliente.password = this.registerForm.get('password').value;
      this.cliente.email = this.registerForm.get('email').value;
      this.cliente.primerNombre = this.registerForm.get('primerNombre').value;
      this.cliente.segundoNombre = this.registerForm.get('segundoNombre').value;
      this.cliente.apellidos = this.registerForm.get('apellidos').value;

      this.cliente.id_pais = this.registerForm.get('pais').value;
      this.cliente.estado = this.registerForm.get('estado').value;
      this.cliente.plan = this.registerForm.get('plan').value;
      this.cliente.sistema = this.registerForm.get('sistema').value;

      this.clienteService.create(this.cliente)
      .subscribe(cliente => {
        swal.fire('Nuevo Cliente','Cliente: '+this.cliente.usuario+' creado con exito!','success');

          this.router.navigate(['/login'])

          this.emailRequest.name = this.cliente.usuario;
          this.emailRequest.from = "";
          this.emailRequest.to = this.cliente.email;
          this.emailRequest.subject = "Confirmacion de Registro";
        console.log(this.emailRequest);

          this.emailService.EmailConfirmacion(this.emailRequest).subscribe(
            (result) => {
              }
          )
        }

      );
    }

  }

  public ListaPaises(){
    this.paisService.getAll().subscribe(
      (result) => {
        this.paises = result;
      }, error => {
        console.log(error);
      }
    );
  }

  public ListaPlanes(){
    this.planService.getAll().subscribe(
      (result) => {
        this.planes = result;
      }, error => {
        console.log(error);
      }
    );
  }

  public ListaSistemas(){
    this.sistemaService.getAll().subscribe(
      (result) => {
        this.sistemas = result;
      }, error => {
        console.log(error);
      }
    );
  }

}
