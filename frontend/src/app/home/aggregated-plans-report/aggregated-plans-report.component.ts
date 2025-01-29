import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IActivityType } from '../../main/plans/components/plan-activity/interfaces/IActivityType';
import { PlansService } from '../../main/plans/plans.service';
import { WorkloadSchedule } from '../../shared/constants/WorkloadSchedule';
import { WorkloadDays } from '../../shared/constants/WorkloadDays';
import { PeriodsService } from '../../main/admin/periods/periods.service';
import { IPeriod } from '../../main/admin/periods/interfaces/IPeriod';
import { IAggregatedPlansSlot } from './interfaces/IAggregatedPlansSlot';
import { IAggregatedPlans } from './interfaces/IAggregatedPlans';
import { getColorByIndex } from '../../shared/helpers/ColorHelper';
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  standalone: false,

  templateUrl: './aggregated-plans-report.component.html',
  styleUrl: './aggregated-plans-report.component.css',
})
export class AggregatedPlansReportComponent implements OnInit {
  period?: IPeriod;

  activityTypeColors: { activityTypeId: string; color: string }[] = [];
  activityTypes: IActivityType[] = [];
  activityTypeId = '';

  workloadSchedule = WorkloadSchedule;
  workloadDays = WorkloadDays;

  aggregatedPlans: IAggregatedPlans[] = [];
  slots: IAggregatedPlansSlot[][] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plansService: PlansService,
    private periodsService: PeriodsService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const periodId = this.route.snapshot.paramMap.get('id');

    if (periodId) {
      this.periodsService.getById(periodId).subscribe({
        next: (period) => {
          this.period = period;
          this.getAggregatedPeriodPlans();
        },
        error: () => {
          this.snackBarService.openSnackBar(
            'Erro ao obter informações do período'
          );
          this.redirectToHome();
        },
      });
    } else {
      this.snackBarService.openSnackBar('Período não especificado');
      this.redirectToHome();
    }

    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;

      res.forEach((x, index) => {
        this.activityTypeColors.push({
          activityTypeId: x.id,
          color: getColorByIndex(index),
        });
      });
    });
  }

  getAggregatedPeriodPlans(): void {
    if (!this.period) return;

    this.periodsService
      .getAggregatedPeriodPlans(this.period.id, this.activityTypeId)
      .subscribe((res) => {
        this.aggregatedPlans = res;
        this.setSlotsData();
      });
  }

  initializeSlots(): void {
    this.slots = this.workloadSchedule.map(() =>
      this.workloadDays.map(
        () =>
          ({
            activities: [],
            color: '',
          } as IAggregatedPlansSlot)
      )
    );
  }

  setSlotsData(): void {
    this.initializeSlots();

    this.aggregatedPlans.forEach((x) => {
      const [rowStr, colStr] = x.slot.split('/');
      const row = +rowStr;
      const col = +colStr;

      if (
        row >= 0 &&
        row < this.workloadSchedule.length &&
        col >= 0 &&
        col < this.workloadDays.length
      ) {
        const activities = x.activities.filter(
          (activity) =>
            this.activityTypeId === '' ||
            activity.activityTypeId === this.activityTypeId
        );

        this.slots[row][col].activities = activities;
      }
    });
  }

  getActivityTypeColor(activityTypeId: string): string {
    return (
      this.activityTypeColors.find((x) => x.activityTypeId === activityTypeId)
        ?.color ?? ''
    );
  }

  redirectToHome(): void {
    this.router.navigateByUrl('');
  }
}
