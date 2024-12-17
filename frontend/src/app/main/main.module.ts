import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PlansComponent } from './plans/plans.component';
import { PlanComponent } from './plans/components/plan/plan.component';
import { PlanActivityComponent } from './plans/components/plan-activity/plan-activity.component';

@NgModule({
  declarations: [
    MainComponent,
    PlansComponent,
    PlanComponent,
    PlanActivityComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class MainModule {}
