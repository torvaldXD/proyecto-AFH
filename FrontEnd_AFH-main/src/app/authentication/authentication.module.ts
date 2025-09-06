import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from '../home/home.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';


@NgModule({
  declarations: [SignInComponent,ForgotPasswordComponent],
  providers: [MessageService,ConfirmationService],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
    InputTextModule,
    ToastModule,
    PasswordModule,
    KeyFilterModule,
  ]
})
export class AuthenticationModule { }
