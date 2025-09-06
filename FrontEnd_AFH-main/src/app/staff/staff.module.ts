import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StaffRoutingModule } from './staff-routing.module';
import { CreateStaffComponent } from './pages/create-staff/create-staff.component';


import { StaffComponent } from './pages/main/staff.component';
import { UpdateStaffComponent } from './pages/update/update-staff/update-staff.component';


import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [
    CreateStaffComponent,
    StaffComponent,
    UpdateStaffComponent
  ],
  providers: [MessageService,ConfirmationService],
  imports: [
    CommonModule,
    StaffRoutingModule,
    ReactiveFormsModule,
    TableModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    PanelModule,
    TooltipModule,MenuModule,
  ]
})
export class StaffModule { }
