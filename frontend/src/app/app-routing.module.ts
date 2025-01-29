import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/guards/auth-guard';
import { AggregatedPlansReportComponent } from './home/aggregated-plans-report/aggregated-plans-report.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'period/:id',
    component: AggregatedPlansReportComponent,
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./main/main.module').then((main) => main.MainModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
