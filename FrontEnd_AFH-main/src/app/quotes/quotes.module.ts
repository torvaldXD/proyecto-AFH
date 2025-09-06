import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { CreateComponent } from './pages/create/create.component';
import { HomeComponent } from './pages/home/home.component';
import { UpdateComponent } from './pages/update/update.component';

import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HistoryFilesComponent } from './pages/history-files/history-files.component';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [
    CreateComponent,
    HomeComponent,
    UpdateComponent,
    HistoryFilesComponent
  ],
  providers: [MessageService,ConfirmationService],
  imports: [
    CommonModule,
    QuotesRoutingModule,

    ProgressSpinnerModule,
    ReactiveFormsModule,
    TableModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    PanelModule,
    AutoCompleteModule,
    DividerModule,
    CheckboxModule,
    TooltipModule,
    MenuModule,
  ]
})
export class QuotesModule { }
