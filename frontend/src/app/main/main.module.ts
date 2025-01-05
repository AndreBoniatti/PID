import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PlansComponent } from './plans/plans.component';
import { PlanComponent } from './plans/components/plan/plan.component';
import { PlanActivityComponent } from './plans/components/plan-activity/plan-activity.component';
import { WorkloadAllocationComponent } from './plans/components/workload-allocation/workload-allocation.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    PlansComponent,
    PlanComponent,
    PlanActivityComponent,
    WorkloadAllocationComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class MainModule {}
