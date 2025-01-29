import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { IPeriod } from '../../main/admin/periods/interfaces/IPeriod';
import { PeriodsService } from '../../main/admin/periods/periods.service';
import { IPeriodPlan } from '../../main/admin/periods/components/period-plans/interfaces/IPeriodPlan';
import { PlanDialogComponent } from '../../main/plans/components/plan-dialog/plan-dialog.component';
import { IPlanDialog } from '../../main/plans/components/plan-dialog/interfaces/IPlanDialog';

@Component({
  standalone: false,
  selector: 'app-period-resume',

  templateUrl: './period-resume.component.html',
  styleUrl: './period-resume.component.css',
})
export class PeriodResumeComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  @Input() period?: IPeriod;
  @Input() expandedByDefault = false;

  dataHasAlreadyBeenLoaded = false;

  periodPlans: IPeriodPlan[] = [];
  displayedColumns: string[] = ['userName', 'actions'];

  constructor(private router: Router, private periodsService: PeriodsService) {}

  ngOnInit(): void {
    if (this.expandedByDefault) this.loadData();
  }

  loadData(): void {
    if (this.dataHasAlreadyBeenLoaded) return;
    this.dataHasAlreadyBeenLoaded = true;
    this.getPeriodPlans();
  }

  getPeriodPlans(): void {
    if (!this.period) return;

    this.periodsService
      .getApprovedPeriodPlans(this.period.id)
      .subscribe((res) => (this.periodPlans = res));
  }

  openPlan(periodPlan: IPeriodPlan): void {
    if (!periodPlan.planId) return;

    this.dialog.open(PlanDialogComponent, {
      data: {
        period: this.period?.description ?? '',
        periodPlan: periodPlan,
      } as IPlanDialog,
      maxWidth: '95vw',
      width: '1100px',
    });
  }

  openAggregatedPlans(): void {
    if (!this.period) return;
    this.router.navigateByUrl(`period/${this.period.id}`);
  }
}
