import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PlansService } from './plans.service';
import { IPlans } from './interfaces/IPlans';
import {
  EPlanSituation,
  getPlanSituationDescription,
} from './enums/EPlanSituation';

@Component({
  standalone: false,

  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css',
})
export class PlansComponent implements OnInit {
  displayedColumns: string[] = ['period', 'situation', 'actions'];
  plans: IPlans[] = [];

  constructor(private plansService: PlansService, private router: Router) {}

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans(): void {
    this.plansService.getAll().subscribe((plans) => {
      this.plans = plans;
    });
  }

  getSituation(situation: number): string {
    return getPlanSituationDescription(situation);
  }

  updatePlan(plandId?: string): void {
    if (plandId) this.router.navigateByUrl(`main/plan/${plandId}`);
    else this.router.navigateByUrl('main/plan');
  }

  planIsApproved(plan: IPlans): boolean {
    return plan.situation === EPlanSituation.APPROVED;
  }
}
