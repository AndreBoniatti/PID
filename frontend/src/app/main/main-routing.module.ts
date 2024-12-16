import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { PlanComponent } from './plan/plan.component';
import { PlanActivityComponent } from './plan/components/plan-activity/plan-activity.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'plans',
        pathMatch: 'full',
      },
      {
        path: 'plans',
        component: PlanComponent,
      },
      {
        path: 'plan',
        component: PlanActivityComponent,
      },
      {
        path: 'plan/:id',
        component: PlanActivityComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
