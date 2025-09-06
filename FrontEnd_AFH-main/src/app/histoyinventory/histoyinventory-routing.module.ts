import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoyinventoryComponent } from './histoyinventory.component';
import { HomeComponent } from './pages/home/home.component';
import { HomebillsComponent } from './pages/homebills/homebills.component';
import { CreateComponent } from './pages/create/create.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'bills', component: HomebillsComponent}, 
  { path: 'create', component: CreateComponent}, 
  { path: 'home', component: HomeComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoyinventoryRoutingModule { }
