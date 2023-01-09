import { LoginUsuario } from './../../models/login-usuario';
import { AuthService } from './../../services/auth.service';
import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{FormGroup, FormBuilder, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { CompaniaService } from 'src/app/services/pages/compania.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ ]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
/*
  nombreUsuario: string;
  password: string;*/
  roles: string[] = [];
  errMsj: string;

  constructor(private tokenService: TokenService,
          private authService: AuthService,
          private companiaService: CompaniaService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();

    if (this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }

  }


  inicializarForm(): void{
    this.loginForm = this.fb.group({
      usuario: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
      password: ['', Validators.required],
     })
  }


    onLogin(): void{
//      this.loginUsuario = new LoginUsuario(this.nombreUsuario,this.password);
/*
    console.log(this.loginForm.get('usuario').value);
    console.log(this.loginForm.get('password').value);
    */

      this.loginUsuario = new LoginUsuario(this.loginForm.get('usuario').value,this.loginForm.get('password').value);

      this.authService.login(this.loginUsuario).subscribe(
        data => {
          this.isLogged = true;
          this.isLoginFail = false;

          this.tokenService.setToken(data.token);
          this.tokenService.setUserName(data.nombreUsuario);
          this.tokenService.setAuthorities(data.authorities);

          this.tokenService.setIdClient(data.idCliente);
          this.tokenService.setIdUser(data.idUsuario);
          this.tokenService.setUserFullName(data.nombreCompleto);
          this.roles = data.authorities;

          this.companiaService.getDefaultByCliente(data.idCliente).subscribe(
            data =>{
              this.tokenService.setIdCompany(data.id);
              this.tokenService.setCompany(data.nombreComercial);
              this.tokenService.setIdPaisCompany(data.idPais);
              this.tokenService.setIdEstadoCompany(data.estado);

//              this.tokenService.nomCompany$.emit(data.nombreComercial);
              this.router.navigate(['dashboard']);
            },
          );

          //this.router.navigate(['dashboard']);
        },
        err =>{
          this.isLogged = false;
          this.isLoginFail = true;
          this.errMsj = err.error.mensaje;
          console.log(this.errMsj);
          Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
          console.clear()
        }

      );

    }

}
