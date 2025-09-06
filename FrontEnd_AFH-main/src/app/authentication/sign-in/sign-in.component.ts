import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  public formLogin: FormGroup;

  blockChars: RegExp = /^[^<>*!-$%&/=;:?¿()''``^^¡{}+\[\]´´¨]+$/;
  isButtonDisabled: boolean = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }
  send() {
    if (
      this.formLogin.value.email == '' ||
      this.formLogin.value.password == ''
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verificación Campos',
        detail: 'Por favor verifiqué que los campos estén rellenados',
        key: 'tl',
        life: 5000,
      });
    } else {
      if (!this.isButtonDisabled) {
        this.isButtonDisabled = true;
        this.auth
          .signIn(this.formLogin.value.email, this.formLogin.value.password)
          .subscribe({
            next: (data) => {
              console.log(data);
              if (data.success === true) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Inicio de sesión éxitoso',
                  detail: 'Se ha iniciado sesión exitosamente',
                  key: 'tl',
                  life: 3000,
                });
                
                this.auth.saveUserStorage(data);
                this.auth.setTokenUser(data.token);
                setTimeout(() => {
                  this.router.navigate(['/home']);
                }, 2000);
              } else if (
                data.success === false &&
                data.message === 'user o password wrong'
              ) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error de autenticación',
                  detail: 'El usuario o la contraseña son incorrectos',
                  key: 'tl',
                  life: 5000,
                });
              } else if (
                data.success === false &&
                data.message === 'User not register'
              ) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error de autenticación',
                  detail: 'El usuario no está registrado',
                  key: 'tl',
                  life: 5000,
                });
              }
            },
            error: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Ocurrió algo en el sistema',
                detail: 'Por favor comuníquese con el administrador',
                key: 'tl',
                life: 5000,
              });
              this.isButtonDisabled = false;
              console.log('ocurrió un error al hacer la petición');
            },
            complete: () => {
              setTimeout(() => {
                this.isButtonDisabled = false;
              }, 3000);
            },
          });
      }
    }
  }
}
