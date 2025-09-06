import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Guard } from './core/guard/guard.guard';
import { RoleComercialGuard } from './core/guard/role.comercial.guard';
import { RoleGerenciaGuard } from './core/guard/role.guard';
import { RoleLogisticaGuard } from './core/guard/role.logistica.guard';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)},
  {path: 'quotes', loadChildren: () => import('./quotes/quotes.module').then(m => m.QuotesModule),canActivate:[Guard,RoleComercialGuard]},
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),canActivate:[Guard]},
  {path: 'staff', loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),canActivate:[Guard,RoleGerenciaGuard]},
  {path: 'supplies', loadChildren: () => import('./supplies/supplies.module').then(m => m.SuppliesModule),canActivate:[Guard,RoleLogisticaGuard]},
  {path: 'employes', loadChildren: () => import('./employes/employes.module').then(m => m.EmployesModule),canActivate:[Guard,RoleGerenciaGuard]},
  {path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule),canActivate:[Guard,RoleLogisticaGuard]},
  {path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),canActivate:[Guard,RoleComercialGuard]},
  {path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),canActivate:[Guard]},
  {path: 'history', loadChildren: () => import('./histoyinventory/histoyinventory.module').then(m => m.HistoyinventoryModule),canActivate:[Guard,RoleLogisticaGuard]},
  {path: 'prueba', loadChildren: () => import('./prueba/prueba.module').then(m => m.PruebaModule)},
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
