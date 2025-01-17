import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IWorkloadSlot } from './interfaces/IWorkloadSlot';
import { IPlanActivityTable } from '../plan-activity/interfaces/IPlanActivityTable';
import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';
import {
  getColorByIndex,
  getSelectionColor,
} from '../../../../shared/helpers/ColorHelper';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { WorkloadAllocationService } from './workload-allocation.service';
import { WorkloadSchedule } from '../../../../shared/constants/WorkloadSchedule';
import { WorkloadDays } from '../../../../shared/constants/WorkloadDays';

@Component({
  standalone: false,
  selector: 'app-workload-allocation',

  templateUrl: './workload-allocation.component.html',
  styleUrl: './workload-allocation.component.css',
})
export class WorkloadAllocationComponent implements OnInit, OnDestroy {
  @Input() readonlyMode = false;
  workloadSchedule = WorkloadSchedule;
  workloadDays = WorkloadDays;
  slots: IWorkloadSlot[][] = [];
  userWorkload = 0;
  currentActivityDescription?: string;
  planActivityTableSubscription?: Subscription;

  constructor(
    private workloadAllocationService: WorkloadAllocationService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.planActivityTableSubscription = this.workloadAllocationService
      .getPlanActivityTable()
      .subscribe((planActivityTable) => {
        if (planActivityTable) this.setTableData(planActivityTable);
      });
  }

  ngOnDestroy(): void {
    this.planActivityTableSubscription?.unsubscribe();
  }

  initializeSlots(): void {
    this.slots = this.workloadSchedule.map(() =>
      this.workloadDays.map(
        () =>
          ({
            activity: '',
            selected: false,
            readonly: this.readonlyMode,
          } as IWorkloadSlot)
      )
    );
  }

  setTableData(planActivityTable: IPlanActivityTable): void {
    this.initializeSlots();

    this.userWorkload = planActivityTable.userWorkload;
    this.currentActivityDescription = planActivityTable?.planActivities.find(
      (x) => x.updating
    )?.description;

    planActivityTable?.planActivities?.forEach((x, index) =>
      this.setPlanActivityAllocation(x, index)
    );
  }

  setPlanActivityAllocation(planActivity: IPlanActivity, index: number) {
    const activityColor =
      !this.readonlyMode && planActivity.updating
        ? getSelectionColor()
        : getColorByIndex(index);

    planActivity?.workloadAllocation?.forEach((pair) => {
      const [rowStr, colStr] = pair.split('/');
      const row = +rowStr;
      const col = +colStr;

      if (
        row >= 0 &&
        row < this.workloadSchedule.length &&
        col >= 0 &&
        col < this.workloadDays.length
      ) {
        this.slots[row][col].activity = planActivity.description;
        this.slots[row][col].selected = true;
        this.slots[row][col].readonly =
          !planActivity.updating || this.readonlyMode;
        this.slots[row][col].color = activityColor;
      }
    });
  }

  toggleSelection(i: number, j: number) {
    if (this.isReadonly(i, j)) return;

    if (
      !this.isSelected(i, j) &&
      this.userWorkload - this.getTotalWorkloadSelected() <= 0
    ) {
      this.snackBarService.openSnackBar('CH máxima já atingida');
      return;
    }

    this.slots[i][j].selected = !this.isSelected(i, j);
    this.slots[i][j].activity = this.isSelected(i, j)
      ? this.currentActivityDescription
      : '';
    this.slots[i][j].color = this.isSelected(i, j) ? getSelectionColor() : '';
  }

  isSelected(i: number, j: number): boolean {
    return this.slots[i][j].selected;
  }

  isReadonly(i: number, j: number): boolean {
    return this.slots[i][j].readonly;
  }

  setActivityDescription(description: string): void {
    this.currentActivityDescription = description;

    for (let i = 0; i < this.slots.length; i++) {
      for (let j = 0; j < this.slots[i].length; j++) {
        if (this.isSelected(i, j) && !this.isReadonly(i, j)) {
          this.slots[i][j].activity = this.currentActivityDescription;
        }
      }
    }
  }

  getSelectedPairs(): string[] {
    const selectedPairs: string[] = [];
    for (let i = 0; i < this.slots.length; i++) {
      for (let j = 0; j < this.slots[i].length; j++) {
        if (this.isSelected(i, j) && !this.isReadonly(i, j)) {
          selectedPairs.push(`${i}/${j}`);
        }
      }
    }

    return selectedPairs;
  }

  getTotalWorkloadSelected(): number {
    let count = 0;
    for (let i = 0; i < this.slots.length; i++) {
      for (let j = 0; j < this.slots[i].length; j++) {
        if (this.isSelected(i, j)) {
          count++;
        }
      }
    }

    return count;
  }
}
