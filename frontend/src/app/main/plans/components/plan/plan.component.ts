import { Component, inject, OnInit } from '@angular/core';

import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansService } from '../../plans.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { PlanActivityComponent } from '../plan-activity/plan-activity.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'description',
    'activityType',
    'workload',
    'actions',
  ];
  dataSource: MatTableDataSource<IPlanActivity> =
    new MatTableDataSource<IPlanActivity>([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plansService: PlansService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.plansService.getById(planId).subscribe((res) => {
        this.dataSource.data = res.activities;
      });
    } else {
      this.plansService.getHasPlanInLastPeriod().subscribe((hasPlan) => {
        if (hasPlan) {
          this.snackBarService.openSnackBar(
            'Usuário já possui plano nesse período'
          );
          this.router.navigateByUrl('main/plans');
        }
      });
    }
  }

  openActivityDialog(activity?: IPlanActivity) {
    const dialogRef = this.dialog.open(PlanActivityComponent, {
      data: activity,
    });

    dialogRef.afterClosed().subscribe((result?: IPlanActivity) => {
      if (result) {
        if (result.id) {
          const activityIndex = this.dataSource.data.findIndex(
            (x) => x.id === result.id
          );

          if (activityIndex >= 0) this.dataSource.data[activityIndex] = result;
        } else {
          this.dataSource.data.push(result);
        }

        this.dataSource.data = this.dataSource.data;
      }
    });
  }
}
