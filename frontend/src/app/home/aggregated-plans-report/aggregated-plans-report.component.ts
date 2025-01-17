import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IActivityType } from '../../main/plans/components/plan-activity/interfaces/IActivityType';
import { PlansService } from '../../main/plans/plans.service';
import { WorkloadSchedule } from '../../shared/constants/WorkloadSchedule';
import { WorkloadDays } from '../../shared/constants/WorkloadDays';

@Component({
  standalone: false,

  templateUrl: './aggregated-plans-report.component.html',
  styleUrl: './aggregated-plans-report.component.css',
})
export class AggregatedPlansReportComponent implements OnInit {
  data?: any = inject(MAT_DIALOG_DATA);

  activityTypes: IActivityType[] = [];
  activityTypeId = '';

  workloadSchedule = WorkloadSchedule;
  workloadDays = WorkloadDays;
  slots: boolean[][] = [];

  constructor(
    private dialogRef: MatDialogRef<AggregatedPlansReportComponent>,
    private plansService: PlansService
  ) {}

  ngOnInit(): void {
    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;
    });

    this.slots = this.workloadSchedule.map(() =>
      this.workloadDays.map(() => false)
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
