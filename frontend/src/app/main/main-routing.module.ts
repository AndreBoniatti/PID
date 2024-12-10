import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { PeriodComponent } from './period/period.component';
import { PlanComponent } from './plan/plan.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'period',
        pathMatch: 'full',
      },
      {
        path: 'period',
        component: PeriodComponent,
      },
      {
        path: 'plan',
        component: PlanComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
