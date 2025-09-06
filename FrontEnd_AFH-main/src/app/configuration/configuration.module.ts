import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { PasswordModule } from 'primeng/password';

//Library necesary
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [ConfigurationComponent, ChangepasswordComponent],
  providers:[MessageService,ConfirmationService],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    // librerias necesarias
    ReactiveFormsModule,
    TableModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    PanelModule,
    PasswordModule,ButtonModule,
    
  ]
})
export class ConfigurationModule { }
