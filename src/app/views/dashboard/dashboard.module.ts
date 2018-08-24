import {NgModule} from '@angular/core';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    DashboardRoutingModule, CommonModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
