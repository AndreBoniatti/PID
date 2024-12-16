import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PlanService } from './plan.service';
import { IPlans } from './interfaces/IPlans';
import { getPlanSituationDescription } from './enums/EPlanSituation';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent implements OnInit {
  displayedColumns: string[] = ['period', 'situation', 'actions'];
  plans: IPlans[] = [];

  constructor(private planService: PlanService, private router: Router) {}

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans(): void {
    this.planService.getAll().subscribe((plans) => {
      console.log(plans);
      this.plans = plans;
    });
  }

  getSituation(situation: number): string {
    return getPlanSituationDescription(situation);
  }

  viewPlan(): void {
    this.router.navigateByUrl('main/plan');
  }

  updatePlan(plandId: string): void {
    if (plandId) this.router.navigateByUrl(`main/plan/${plandId}`);
    else this.router.navigateByUrl('main/plan');
  }
}
