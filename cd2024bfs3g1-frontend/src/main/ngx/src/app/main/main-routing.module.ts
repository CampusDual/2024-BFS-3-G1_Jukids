import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'user-profile', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      { path: 'toys', loadChildren: () => import('./toys/toys.module').then(m => m.ToysModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
