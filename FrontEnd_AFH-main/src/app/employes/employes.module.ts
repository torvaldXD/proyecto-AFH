import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployesRoutingModule } from './employes-routing.module';


//Library necesary
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';



@NgModule({
  declarations: [ HomeComponent, CreateComponent, UpdateComponent],
  providers:[MessageService,ConfirmationService],
  imports: [
    CommonModule,
    EmployesRoutingModule,
    //Library
    ReactiveFormsModule,
    TableModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    PanelModule,
    ButtonModule,
    MenuModule,
  ]
})
export class EmployesModule { }
