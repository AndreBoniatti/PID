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
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PeriodsComponent } from './periods/periods.component';
import { CreatePeriodComponent } from './periods/components/create-period/create-period.component';
import { PeriodPlansComponent } from './periods/components/period-plans/period-plans.component';

@NgModule({
  declarations: [
    AdminComponent,
    PeriodsComponent,
    CreatePeriodComponent,
    PeriodPlansComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
    MatRadioModule,
    MatPaginatorModule,
  ],
})
export class AdminModule {}
