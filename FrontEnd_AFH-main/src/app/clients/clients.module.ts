import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { HomeComponent } from './pages/home/home.component';
import { UpdateComponent } from './pages/update/update.component';

// Library PrimeNg
import { TagModule } from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [
    CreateComponent,
    HomeComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,

    ReactiveFormsModule,
    TableModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    TagModule,
    PanelModule,
    TooltipModule,
    MenuModule,
  ],
  providers: [MessageService,ConfirmationService]
})
export class ClientsModule { }
