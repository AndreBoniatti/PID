import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IActivityType } from '../../main/plans/components/plan-activity/interfaces/IActivityType';
import { PlansService } from '../../main/plans/plans.service';
import { WorkloadSchedule } from '../../shared/constants/WorkloadSchedule';
import { WorkloadDays } from '../../shared/constants/WorkloadDays';
import { PeriodsService } from '../../main/admin/periods/periods.service';
import { IPeriod } from '../../main/admin/periods/interfaces/IPeriod';
import { IAggregatedPlansSlot } from './interfaces/IAggregatedPlansSlot';
import { IAggregatedPlans } from './interfaces/IAggregatedPlans';
import { getColorByIndex } from '../../shared/helpers/ColorHelper';

@Component({
  standalone: false,

  templateUrl: './aggregated-plans-report.component.html',
  styleUrl: './aggregated-plans-report.component.css',
})
export class AggregatedPlansReportComponent implements OnInit {
  data?: IPeriod = inject(MAT_DIALOG_DATA);

  activityTypeColors: { activityTypeId: string; color: string }[] = [];
  activityTypes: IActivityType[] = [];
  activityTypeId = '';

  workloadSchedule = WorkloadSchedule;
  workloadDays = WorkloadDays;

  aggregatedPlans: IAggregatedPlans[] = [];
  slots: IAggregatedPlansSlot[][] = [];

  constructor(
    private dialogRef: MatDialogRef<AggregatedPlansReportComponent>,
    private plansService: PlansService,
    private periodsService: PeriodsService
  ) {}

  ngOnInit(): void {
    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;

      res.forEach((x, index) => {
        this.activityTypeColors.push({
          activityTypeId: x.id,
          color: getColorByIndex(index),
        });
      });
    });

    this.getAggregatedPeriodPlans();
  }

  getAggregatedPeriodPlans(): void {
    if (!this.data) return;

    this.periodsService
      .getAggregatedPeriodPlans(this.data.id, this.activityTypeId)
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

  close(): void {
    this.dialogRef.close();
  }
}
