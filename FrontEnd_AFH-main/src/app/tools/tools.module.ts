import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { SharedModule } from '../core/shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    SharedModule
  ]
})
export class ToolsModule { }
