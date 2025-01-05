import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PlansService } from '../../plans.service';
import { IActivityType } from './interfaces/IActivityType';
import { IPlanActivity } from './interfaces/IPlanActivity';
import { WorkloadAllocationComponent } from '../workload-allocation/workload-allocation.component';
import { IPlanActivityTable } from './interfaces/IPlanActivityTable';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  standalone: false,

  templateUrl: './plan-activity.component.html',
  styleUrl: './plan-activity.component.css',
})
export class PlanActivityComponent implements OnInit {
  data?: IPlanActivityTable = inject(MAT_DIALOG_DATA);
  activityTypes: IActivityType[] = [];

  @ViewChild('workloadAllocation')
  workloadAllocation?: WorkloadAllocationComponent;

  description = '';
  activityTypeId = '';

  constructor(
    private dialogRef: MatDialogRef<PlanActivityComponent>,
    private plansService: PlansService,
    private snackBarService: SnackBarService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;
    });

    if (this.data?.updating) {
      this.description = this.data.updating.description;
      this.activityTypeId = this.data.updating.activityType?.id ?? '';
    }
  }

  descriptionChanged(): void {
    this.workloadAllocation?.setActivityDescription(this.description);
  }

  formIsValid(): boolean {
    return !!this.description && !!this.activityTypeId;
  }

  close(save: boolean): void {
    if (save) {
      const workloadAllocation =
        this.workloadAllocation?.getSelectedPairs() ?? [];

      if (!this.formIsValid() || workloadAllocation.length <= 0) {
        this.snackBarService.openSnackBar(
          'Informe todos os campos e ao menos um horário'
        );
        return;
      }

      const planActivity: IPlanActivity = {
        id: this.data?.updating?.id,
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
