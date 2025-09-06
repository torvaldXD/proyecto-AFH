import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PruebaRoutingModule } from './prueba-routing.module';
import { PruebaComponent } from './prueba.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';


@NgModule({
  declarations: [PruebaComponent],
  providers: [MessageService,ConfirmationService],
  imports: [
    CommonModule,
    PruebaRoutingModule,
    ReactiveFormsModule,
    TableModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    PanelModule,
    TooltipModule,
    DialogModule,
    MenuModule,
    SpeedDialModule,
    SplitButtonModule
  ]
})
export class PruebaModule { }
