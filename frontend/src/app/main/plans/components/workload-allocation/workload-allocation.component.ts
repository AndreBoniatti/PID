import { Component, Input, OnInit } from '@angular/core';
import { IWorkloadSlot } from './interfaces/IWorkloadSlot';
import { IPlanActivityTable } from '../plan-activity/interfaces/IPlanActivityTable';
import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';

@Component({
  standalone: false,
  selector: 'app-workload-allocation',

  templateUrl: './workload-allocation.component.html',
  styleUrl: './workload-allocation.component.css',
})
export class WorkloadAllocationComponent implements OnInit {
  @Input() planActivity?: IPlanActivityTable;
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  times = Array.from({ length: 13 }, (_, i) => i + 1);
  slots: IWorkloadSlot[][] = [];

  currentActivityDescription?: string;

  constructor() {
    this.slots = this.times.map(() =>
      this.days.map(
        () =>
          ({ activity: '', selected: false, readonly: false } as IWorkloadSlot)
      )
    );
  }

  ngOnInit(): void {
    this.currentActivityDescription = this.planActivity?.updating?.description;

    this.test(this.planActivity?.updating);
    this.planActivity?.alreadySaved?.forEach((x) => this.test(x, true));
  }

  test(planActivity?: IPlanActivity, readonly: boolean = false) {
    planActivity?.workloadAllocation?.forEach((pair) => {
      const [rowStr, colStr] = pair.split('/');
      const row = +rowStr;
      const col = +colStr;

      if (
        row >= 0 &&
        row < this.times.length &&
        col >= 0 &&
        col < this.days.length
      ) {
        this.slots[row][col].activity = planActivity.description;
        this.slots[row][col].selected = true;
        this.slots[row][col].readonly = readonly;
      }
    });
  }

  toggleSelection(i: number, j: number) {
    if (this.isReadonly(i, j)) return;

    this.slots[i][j].selected = !this.slots[i][j].selected;
    this.slots[i][j].activity = this.slots[i][j].selected
      ? this.currentActivityDescription
      : '';
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
}
