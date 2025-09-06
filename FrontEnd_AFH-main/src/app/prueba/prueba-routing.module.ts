import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebaComponent } from './prueba.component';
import { HistoyinventoryComponent } from '../histoyinventory/histoyinventory.component';

const routes: Routes = [
  { path: '', component: PruebaComponent },
  { path: 'create', component: HistoyinventoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebaRoutingModule { }
