import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';
import { PlansService } from '../../plans.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { PlanActivityComponent } from '../plan-activity/plan-activity.component';
import { IPlanActivityTable } from '../plan-activity/interfaces/IPlanActivityTable';
import { UserService } from '../../../../auth/user.service';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  planId: string | null = null;

  displayedColumns: string[] = [
    'description',
    'activityType',
    'workload',
    'actions',
  ];
  dataSource: MatTableDataSource<IPlanActivity> =
    new MatTableDataSource<IPlanActivity>([]);

  userWorkload = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plansService: PlansService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.planId = this.route.snapshot.paramMap.get('id');

    if (this.planId) this.getPlan(this.planId);
    else {
      this.plansService.getHasPlanInLastPeriod().subscribe((hasPlan) => {
        if (hasPlan) {
          this.snackBarService.openSnackBar(
            'Usuário já possui plano nesse período'
          );
          this.router.navigateByUrl('main/plans');
        }
      });
    }

    this.userService.getWorkload().subscribe({
      next: (workload) => {
        this.userWorkload = workload;
      },
      error: () => {
        this.snackBarService.openSnackBar('Erro ao obter CH do usuário');
        this.router.navigateByUrl('main/plans');
      },
    });
  }

  getPlan(planId: string): void {
    this.plansService.getById(planId).subscribe((res) => {
      this.dataSource.data = res.activities;
    });
  }

  getTotalWorkloadSaved(): number {
    return this.dataSource.data.reduce((a, b) => {
      return a + b.workload;
    }, 0);
  }

  getWorkloadRemaining(): number {
    return this.userWorkload - this.getTotalWorkloadSaved();
  }

  openActivityDialog(activity?: IPlanActivity): void {
    const dialogData: IPlanActivityTable = {
      userWorkload: this.userWorkload,
      updating: activity,
      alreadySaved: this.dataSource.data.filter((x) => x.id !== activity?.id),
    };

    const dialogRef = this.dialog.open(PlanActivityComponent, {
      data: dialogData,
      maxWidth: '100vw',
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result?: IPlanActivity) => {
      if (!result) return;

      if (result.id) {
        const activityIndex = this.dataSource.data.findIndex(
          (x) => x.id === result.id
        );

        if (activityIndex >= 0) {
          this.plansService
            .putPlanActivity(result.id, {
              activityTypeId: result.activityType!.id,
              description: result.description,
              workloadAllocation: result.workloadAllocation,
            })
            .subscribe(() => {
              this.getPlan(this.planId!);
            });
        }
      } else {
        this.plansService
          .postPlanActivity({
            planId: this.planId,
            activityTypeId: result.activityType!.id,
            description: result.description,
            workloadAllocation: result.workloadAllocation,
          })
          .subscribe((res) => {
            if (!this.planId)
              this.router.navigateByUrl(`main/plan/${res.planId}`);
            else this.getPlan(this.planId);
          });
      }
    });
  }
}
