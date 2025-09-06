import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoyinventoryRoutingModule } from './histoyinventory-routing.module';

import { TabViewModule } from 'primeng/tabview';
import { HistoyinventoryComponent } from './histoyinventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HomeComponent } from './pages/home/home.component';
import { HomebillsComponent } from './pages/homebills/homebills.component';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { CreateComponent } from './pages/create/create.component';

@NgModule({
  declarations: [HistoyinventoryComponent, HomeComponent, HomebillsComponent,CreateComponent ],
  providers:[MessageService,ConfirmationService],
  imports: [
    CommonModule,
    HistoyinventoryRoutingModule,
    ReactiveFormsModule,
    TableModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    TooltipModule,
    DialogModule,
    TabViewModule,
    CalendarModule,
    InputNumberModule,
    SelectButtonModule,
    AutoCompleteModule,
    DividerModule,
    MenuModule,
  ]
})
export class HistoyinventoryModule { }
