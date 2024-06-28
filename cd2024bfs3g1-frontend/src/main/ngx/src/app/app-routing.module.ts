import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './shared/components/stripe/checkout/checkout.component';
import { SurveyComponent } from './shared/components/survey/survey.component';
import { ChatComponent } from './shared/components/chat/chat.component';

export const routes: Routes = [
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  //{ path: 'register', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'chat', component: ChatComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
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
