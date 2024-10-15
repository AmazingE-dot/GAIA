import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UsuariosComponent } from '../../page/usuarios/usuarios.component';
import { LoginInterface } from '../../core/interface/login.interface';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import Swal from 'sweetalert2';
import { PATH } from '../../core/enum/path.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, UsuariosComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLogin: boolean = false;

  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private router = inject(Router);

  get formLogin() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.crearFormularioLogin();
  }

  crearFormularioLogin() {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      remember: [false],
    });
  }

  login() {
    this.isLogin = true;

    if (this.loginForm.invalid) {
      return;
    }

    const data = this.loginForm.value;

    const loginData: LoginInterface = {
      correo: data.correo,
      password: data.password,
    };

    this.usuarioService.login(loginData).subscribe({
      next: (resp: any) => {
        if (resp && resp.usuario) {
          const { nombre, apellido1, apellido2 } = resp.usuario;

          Swal.fire({
            icon: 'success',
            html: `Bienvenido ${nombre} ${apellido1} ${apellido2}`,
          }).then(() => {
            this.router.navigateByUrl(`/${PATH.USUARIO}`);
          });
        }
      },
      error: (error:any) => {
        Swal.fire({
          icon: 'error',
          html: `Credenciales invalidas`
        })
        console.log(error.error.msg);
      }
    });
  }
}
