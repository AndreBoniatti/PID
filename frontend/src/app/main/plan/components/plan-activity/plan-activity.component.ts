import { Component, OnInit } from '@angular/core';

import { IPlanActivity } from './interfaces/IPlanActivity';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../../plan.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  standalone: false,

  templateUrl: './plan-activity.component.html',
  styleUrl: './plan-activity.component.css',
})
export class PlanActivityComponent implements OnInit {
  displayedColumns: string[] = ['description', 'workload', 'actions'];
  activities: IPlanActivity[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.planService.getById(planId).subscribe((res) => {
        this.activities = res.activities;
      });
    } else {
      this.planService.getHasPlanInLastPeriod().subscribe((hasPlan) => {
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
