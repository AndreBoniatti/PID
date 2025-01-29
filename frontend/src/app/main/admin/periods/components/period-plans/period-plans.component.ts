import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { IPeriod } from '../../interfaces/IPeriod';
import {
  EPlanSituation,
  getPlanSituationDescription,
} from '../../../../plans/enums/EPlanSituation';
import { PeriodsService } from '../../periods.service';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Debounce } from '../../../../../shared/helpers/Debounce';
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

  periodPlans: IPeriodPlan[] = [];
  displayedColumns: string[] = [
    'userName',
    'userWorkload',
    'planSituation',
    'actions',
  ];

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

  getPeriodPlans(): void {
    if (!this.data) return;

    this.periodsService
      .getPeriodPlans(
        this.data.id,
        this.planSituationFilter,
        this.userNameFilter
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

  @Debounce(500)
  applyFilter(): void {
    this.getPeriodPlans();
  }

  getSituation(situation: number): string {
    return getPlanSituationDescription(situation);
  }

  openPlan(periodPlan: IPeriodPlan): void {
    if (!periodPlan.planId) {
      this.snackBarService.openSnackBar('Plano não iniciado');
      return;
    }

    const dialogRef = this.dialog.open(PlanDialogComponent, {
      data: {
        period: this.data?.description ?? '',
        periodPlan: periodPlan,
      } as IPlanDialog,
      maxWidth: '95vw',
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe((situationWasChanged) => {
      if (situationWasChanged) this.getPeriodPlans();
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
