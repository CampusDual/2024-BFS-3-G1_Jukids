import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { OntimizeWebModule } from "ontimize-web-ngx";
import { OChartModule } from "ontimize-web-ngx-charts";
import { AdminHomeComponent } from './admin-home/admin-home.component';

@NgModule({
  declarations: [AdminHomeComponent],
  imports: [CommonModule, OntimizeWebModule, AdminRoutingModule, OChartModule],
})
export class AdminModule {}
