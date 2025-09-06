import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  public formForgotPassword: FormGroup;
  isButtonDisabled:boolean = false;
  blockChars: RegExp = /^[^<>*!-$%&/=;:?¿()''``^^¡{}+\[\]´´¨]+$/;

  constructor(private messageService:MessageService, private fb: FormBuilder, public auth: AuthenticationService) { }

  ngOnInit(): void {
    this.formForgotPassword= this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/),
        ],
      ]
    });
  }



  send() {

    if(this.formForgotPassword.value.email==''){
      this.messageService.add({
        severity: 'warn',
        summary: 'Verificación Campos',
        detail: 'Por favor ingresé un email',
        key: 'tc',
        life: 5000
      });
    }
    else{
      if (!this.isButtonDisabled) {
        this.isButtonDisabled = true;
      }
      this.auth
      .recoverPassword(this.formForgotPassword.value.email)
      .subscribe({
        next: (data) => {
          if(data.success===true){
            this.messageService.add({
              severity: 'success',
              summary: 'Recuperación Exitosa',
              detail: 'Por favor verifiqué su bandeja de correo',
              key: 'tc',
              life: 4000
            });
            setTimeout(() => {
              window.location.replace('/auth');
            }, 6000);
          }else if(data.success===false){
            this.messageService.add({
              severity: 'error',
              summary: 'Usuario No Registrado',
              detail: 'El email ingresado no corresponde a un usuario registrado',
              key: 'tc',
              life: 5000
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Ocurrió algo en el sistema',
            detail: 'Por favor comuníquese con el administrador',
            key: 'tc',
            life: 5000
          });
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
