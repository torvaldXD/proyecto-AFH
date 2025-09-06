import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
  { path: '', component: ConfigurationComponent },
  {path: 'configuration', loadChildren: () => import('./configuration.module').then(m => m.ConfigurationModule)},
  {path: 'changePassword',component: ChangepasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
