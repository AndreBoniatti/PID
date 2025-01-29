import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { PeriodsComponent } from './periods/periods.component';
import { PeriodPlansComponent } from './periods/components/period-plans/period-plans.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'periods',
        pathMatch: 'full',
      },
      {
        path: 'periods',
        component: PeriodsComponent,
      },
      {
        path: 'period/:id',
        component: PeriodPlansComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
