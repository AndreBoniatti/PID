import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { IPeriod } from '../../main/admin/periods/interfaces/IPeriod';
import { PeriodsService } from '../../main/admin/periods/periods.service';
import { IPagedList } from '../../shared/interfaces/IPagedList';
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

  periodPlans: IPagedList<IPeriodPlan> = {
    data: [],
    totalCount: 0,
  };

  displayedColumns: string[] = ['userName', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private periodsService: PeriodsService) {}

  ngOnInit(): void {
    if (this.expandedByDefault) this.loadData();
  }

  loadData(): void {
    if (this.dataHasAlreadyBeenLoaded) return;
    this.dataHasAlreadyBeenLoaded = true;
    this.getPeriodPlans();
  }

  getPeriodPlans(pageIndex?: number, pageSize?: number): void {
    if (!this.period) return;

    this.periodsService
      .getApprovedPeriodPlans(this.period.id, pageIndex, pageSize)
      .subscribe((res) => (this.periodPlans = res));
  }

  applyPagination(event: PageEvent): void {
    this.getPeriodPlans(event.pageIndex, event.pageSize);
  }

  openPlan(periodPlan: IPeriodPlan): void {
    this.dialog.open(PlanDialogComponent, {
      data: {
        period: this.period?.description ?? '',
        periodPlan: periodPlan,
      } as IPlanDialog,
      maxWidth: '95vw',
      width: '1100px',
    });
  }
}
