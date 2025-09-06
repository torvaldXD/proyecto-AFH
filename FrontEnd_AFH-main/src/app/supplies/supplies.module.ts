import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliesRoutingModule } from './supplies-routing.module';
import { SuppliesComponent } from './pages/list/supplies.component';
import { TooltipModule } from 'primeng/tooltip';

//Library necesary
import { TagModule } from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [SuppliesComponent, CreateComponent, UpdateComponent],
  providers:[MessageService,ConfirmationService],
  imports: [
    CommonModule,
    SuppliesRoutingModule,
    //Library
    ReactiveFormsModule,
    TableModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    ConfirmDialogModule,
    TagModule,
    KeyFilterModule,
    PanelModule,
    TooltipModule,
    MenuModule,
  ]
})
export class SuppliesModule { }
