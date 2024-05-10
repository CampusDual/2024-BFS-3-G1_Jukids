import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { MyToyDetailComponent } from './main/user-profile/my-toy-detail/my-toy-detail.component';

export const routes: Routes = [
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  //{ path: 'register', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: '**', redirectTo: 'main', pathMatch: 'full' },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];

const opt: ExtraOptions = {
  enableTracing: false
  // true if you want to print navigation routes
};

@NgModule({
  imports: [RouterModule.forRoot(routes, opt)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
