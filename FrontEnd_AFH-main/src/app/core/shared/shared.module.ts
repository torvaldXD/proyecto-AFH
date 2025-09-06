// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Library PrimeNg
import { TagModule } from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';

import {HomeComponent} from '../../tools/pages/home/home.component'
import {CreateComponent} from '../../tools/pages/create/create.component'
import {UpdateComponent} from '../../tools/pages/update/update.component'
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';



@NgModule({
  declarations: [HomeComponent,CreateComponent,UpdateComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    FileUploadModule,
    FormsModule,
    ConfirmDialogModule,
    TagModule,
    PanelModule,
    AutoCompleteModule,
    DividerModule,
    TooltipModule,MenuModule,
  ],
  // exports[SharedModule],
  providers: [MessageService,ConfirmationService]
})
export class SharedModule { }
