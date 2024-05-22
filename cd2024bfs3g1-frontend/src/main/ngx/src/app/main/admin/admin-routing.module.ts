import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';

const routes: Routes = [
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: '', component: AdminHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
