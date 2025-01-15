import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { IPeriod } from '../../interfaces/IPeriod';
import {
  EPlanSituation,
  getPlanSituationDescription,
} from '../../../../plans/enums/EPlanSituation';
import { PeriodsService } from '../../periods.service';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Debounce } from '../../../../../shared/helpers/Debounce';
import { IPagedList } from '../../../../../shared/interfaces/IPagedList';
import { IPeriodPlan } from './interfaces/IPeriodPlan';
import { PlanDialogComponent } from '../../../../plans/components/plan-dialog/plan-dialog.component';
import { IPlanDialog } from '../../../../plans/components/plan-dialog/interfaces/IPlanDialog';

@Component({
  standalone: false,

  templateUrl: './period-plans.component.html',
  styleUrl: './period-plans.component.css',
})
export class PeriodPlansComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  data?: IPeriod = inject(MAT_DIALOG_DATA);

  displayedColumns: string[] = [
    'userName',
    'userWorkload',
    'planSituation',
    'actions',
  ];
  periodPlans: IPagedList<IPeriodPlan> = {
    data: [],
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  pageIndex = 0;
  pageSize = 5;

  planSituation = EPlanSituation;

  userNameFilter = '';
  planSituationFilter = EPlanSituation.SENT;

  constructor(
    private dialogRef: MatDialogRef<PeriodPlansComponent>,
    private periodsService: PeriodsService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getPeriodPlans();
  }

  getPeriodPlans(pageIndex?: number, pageSize?: number): void {
    if (!this.data) return;

    this.periodsService
      .getPeriodPlans(
        this.data.id,
        pageIndex,
        pageSize,
        this.userNameFilter,
        this.planSituationFilter
      )
      .subscribe({
        next: (res) => {
          this.periodPlans = res;
        },
        error: () => {
          this.snackBarService.openSnackBar('Erro ao obter planos do período');
        },
      });
  }

  applyPagination(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPeriodPlans(event.pageIndex, event.pageSize);
  }

  @Debounce(500)
  applyFilter(): void {
    this.getPeriodPlans(0, this.pageSize);
    if (this.paginator) this.paginator.firstPage();
  }

  getSituation(situation: number): string {
    return getPlanSituationDescription(situation);
  }

  openPlan(periodPlan: IPeriodPlan): void {
    this.dialog.open(PlanDialogComponent, {
      data: {
        period: this.data?.description ?? '',
        periodPlan: periodPlan,
      } as IPlanDialog,
      maxWidth: '95vw',
      width: '1100px',
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
