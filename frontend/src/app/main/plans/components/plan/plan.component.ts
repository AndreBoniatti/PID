import { Component, OnInit } from '@angular/core';

import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansService } from '../../plans.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent implements OnInit {
  displayedColumns: string[] = ['description', 'workload', 'actions'];
  activities: IPlanActivity[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plansService: PlansService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.plansService.getById(planId).subscribe((res) => {
        this.activities = res.activities;
      });
    } else {
      this.plansService.getHasPlanInLastPeriod().subscribe((hasPlan) => {
        if (hasPlan) {
          this.snackBarService.openSnackBar(
            'Usuário já possui plano nesse período'
          );
          this.router.navigateByUrl('main/plans');
        }
      });
    }
  }
}
