import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliesComponent } from './pages/list/supplies.component';
import { CreateComponent } from './pages/create/create.component';
import { UpdateComponent } from './pages/update/update.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'create',component: CreateComponent},
  {path: 'update',component: UpdateComponent},
  {path: 'home',component: SuppliesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliesRoutingModule { }
