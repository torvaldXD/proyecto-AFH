import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffComponent } from './pages/main/staff.component';
import { CreateStaffComponent } from './pages/create-staff/create-staff.component';
import { UpdateStaffComponent } from './pages/update/update-staff/update-staff.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'create',component: CreateStaffComponent},
  {path: 'update',component: UpdateStaffComponent},
  {path: 'home',component: StaffComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
