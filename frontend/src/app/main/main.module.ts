import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PlanComponent } from './plan/plan.component';
import { PlanActivityComponent } from './plan/components/plan-activity/plan-activity.component';

@NgModule({
  declarations: [MainComponent, PlanComponent, PlanActivityComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
  ],
})
export class MainModule {}
