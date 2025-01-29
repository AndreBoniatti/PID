import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

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

  period?: IPeriod;

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
    private router: Router,
    private route: ActivatedRoute,
    private periodsService: PeriodsService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const periodId = this.route.snapshot.paramMap.get('id');

    if (periodId) {
      this.periodsService.getById(periodId).subscribe({
        next: (period) => {
          this.period = period;
          this.getPeriodPlans();
        },
        error: () => {
          this.snackBarService.openSnackBar(
            'Erro ao obter informações do período'
          );
          this.router.navigateByUrl('main/admin/periods');
        },
      });
    } else {
      this.snackBarService.openSnackBar('Período não especificado');
      this.router.navigateByUrl('main/admin/periods');
    }
  }

  getPeriodPlans(): void {
    if (!this.period) return;

    this.periodsService
      .getPeriodPlans(
        this.period.id,
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
        period: this.period?.description ?? '',
        periodPlan: periodPlan,
      } as IPlanDialog,
      maxWidth: '95vw',
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe((situationWasChanged) => {
      if (situationWasChanged) this.getPeriodPlans();
    });
  }
}
