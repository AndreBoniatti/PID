import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PlansService } from '../../plans.service';
import { IActivityType } from './interfaces/IActivityType';
import { IPlanActivity } from './interfaces/IPlanActivity';
import { WorkloadAllocationComponent } from '../workload-allocation/workload-allocation.component';

@Component({
  standalone: false,

  templateUrl: './plan-activity.component.html',
  styleUrl: './plan-activity.component.css',
})
export class PlanActivityComponent implements OnInit {
  data?: IPlanActivity = inject(MAT_DIALOG_DATA);
  activityTypes: IActivityType[] = [];

  @ViewChild('workloadAllocation')
  workloadAllocation?: WorkloadAllocationComponent;

  description = '';
  activityTypeId = '';

  constructor(
    private dialogRef: MatDialogRef<PlanActivityComponent>,
    private plansService: PlansService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;
    });

    if (this.data) {
      this.description = this.data.description;
      this.activityTypeId = this.data.activityType?.id ?? '';
    }
  }

  close(save: boolean): void {
    if (save) {
      const workloadAllocation =
        this.workloadAllocation?.getSelectedPairs() ?? [];

      const planActivity: IPlanActivity = {
        id: this.data?.id,
        description: this.description,
        workload: workloadAllocation.length,
        workloadAllocation: workloadAllocation,
        activityType: {
          id: this.activityTypeId,
          description:
            this.activityTypes.find((x) => x.id === this.activityTypeId)
              ?.description ?? '',
        },
      };

      this.dialogRef.close(planActivity);
    } else this.dialogRef.close();
  }
}
