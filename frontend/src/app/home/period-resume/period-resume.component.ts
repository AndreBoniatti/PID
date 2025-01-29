import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IPeriod } from '../../main/admin/periods/interfaces/IPeriod';
import { PeriodsService } from '../../main/admin/periods/periods.service';
import { IPeriodPlan } from '../../main/admin/periods/components/period-plans/interfaces/IPeriodPlan';
import { PlanDialogComponent } from '../../main/plans/components/plan-dialog/plan-dialog.component';
import { IPlanDialog } from '../../main/plans/components/plan-dialog/interfaces/IPlanDialog';
import { AggregatedPlansReportComponent } from '../aggregated-plans-report/aggregated-plans-report.component';

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

  constructor(private periodsService: PeriodsService) {}

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
    this.dialog.open(AggregatedPlansReportComponent, {
      data: this.period,
      maxWidth: '95vw',
      width: '1250px',
    });
  }
}
