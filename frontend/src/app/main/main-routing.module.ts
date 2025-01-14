import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { PlansComponent } from './plans/plans.component';
import { PlanComponent } from './plans/components/plan/plan.component';
import { AuthGuard } from '../auth/guards/auth-guard';
import { AdminGuard } from '../auth/guards/admin-guard';

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
        component: PlansComponent,
      },
      {
        path: 'plan',
        component: PlanComponent,
      },
      {
        path: 'plan/:id',
        component: PlanComponent,
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((admin) => admin.AdminModule),
        canActivate: [AuthGuard, AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
