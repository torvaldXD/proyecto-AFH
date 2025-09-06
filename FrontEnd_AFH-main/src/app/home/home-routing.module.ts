import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [{ path: '', component: HomeComponent },
{path: 'home', loadChildren: () => import('./home.module').then(m => m.HomeModule)},
{
  path: 'staff',
  redirectTo: 'staff',
  pathMatch: 'full'
},
{path: 'staff', loadChildren: () => import('../staff/staff.module').then(m => m.StaffModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
