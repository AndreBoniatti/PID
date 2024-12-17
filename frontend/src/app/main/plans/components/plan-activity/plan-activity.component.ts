import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PlansService } from '../../plans.service';
import { IActivityType } from './interfaces/IActivityType';

@Component({
  standalone: false,

  templateUrl: './plan-activity.component.html',
  styleUrl: './plan-activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanActivityComponent implements OnInit {
  data?: string = inject(MAT_DIALOG_DATA);
  activityTypes: IActivityType[] = [];

  constructor(private plansService: PlansService) {}

  ngOnInit(): void {
    this.plansService.getActivityTypes().subscribe((res) => {
      this.activityTypes = res;
    });

    if (this.data) {
      // get data
    }
  }
}
