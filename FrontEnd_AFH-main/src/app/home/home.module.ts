import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PanelModule } from 'primeng/panel';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    PanelModule
  ]
})
export class HomeModule { }
