import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AboutJukidsComponent } from './about-jukids/about-jukids.component';
import { AboutModule } from './about.module';

const routes: Routes = [
  {
    path: "about-us",
    component: AboutUsComponent
  },
  {
    path: "about-jukids",
    component: AboutJukidsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
