import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { IPlanActivity } from '../plan-activity/interfaces/IPlanActivity';
import { PlansService } from '../../plans.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { PlanActivityComponent } from '../plan-activity/plan-activity.component';
import { IPlanActivityTable } from '../plan-activity/interfaces/IPlanActivityTable';
import { ConfirmDialogService } from '../../../confirm-dialog/confirm-dialog.service';
import { WorkloadAllocationService } from '../workload-allocation/workload-allocation.service';
import { IPlan } from './interfaces/IPlan';
import { EPlanSituation } from '../../enums/EPlanSituation';
import { UserService } from '../../../../auth/user.service';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  planId: string | null = null;
  plan?: IPlan;

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
    private workloadAllocationService: WorkloadAllocationService,
    private snackBarService: SnackBarService,
    private confirmDialogService: ConfirmDialogService
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
  }

  getPlan(planId: string): void {
    this.plansService.getById(planId).subscribe({
      next: (res) => {
        this.plan = res;
        this.dataSource.data = res.activities ?? [];
        this.userWorkload = res.user?.workload ?? 0;

        this.workloadAllocationService.setPlanActivityTable(
          this.getPlanActivityData()
        );
      },
      error: () => {
        this.snackBarService.openSnackBar('Erro ao obter informações do plano');
        this.router.navigateByUrl('main/plans');
      },
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

  getPlanActivityData(activity?: IPlanActivity): IPlanActivityTable {
    return {
      userWorkload: this.userWorkload,
      planActivities: this.dataSource.data.map((x) => {
        return {
          ...x,
          updating: x.id === activity?.id,
        };
      }),
    };
  }

  openActivityDialog(activity?: IPlanActivity): void {
    this.workloadAllocationService.setPlanActivityTable(
      this.getPlanActivityData(activity)
    );

    const dialogRef = this.dialog.open(PlanActivityComponent, {
      data: activity,
      maxWidth: '100vw',
      width: '90%',
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
            .subscribe({
              next: () => {
                this.snackBarService.openSnackBar(
                  'Atividade editada com sucesso'
                );

                this.getPlan(this.planId!);
              },
              error: () => {
                this.snackBarService.openSnackBar('Erro ao editar atividade');
              },
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
          .subscribe({
            next: (res) => {
              this.snackBarService.openSnackBar(
                'Atividade adicionada com sucesso'
              );

              if (!this.planId)
                this.router.navigateByUrl(`main/plan/${res.planId}`);
              else this.getPlan(this.planId);
            },
            error: () => {
              this.snackBarService.openSnackBar('Erro ao adicionar atividade');
            },
          });
      }
    });
  }

  deleteActivity(activity: IPlanActivity) {
    this.confirmDialogService
      .openDialog(`Deseja deletar a atividade: ${activity.description}?`)
      .subscribe((confirm) => {
        if (confirm) {
          this.plansService.deletePlanActivity(activity.id!).subscribe({
            next: () => {
              this.snackBarService.openSnackBar(
                'Atividade deletada com sucesso'
              );
              this.getPlan(this.planId!);
            },
            error: () => {
              this.snackBarService.openSnackBar('Erro ao deletar atividade');
            },
          });
        }
      });
  }

  getWorkloadAllocationReport(): void {
    if (!this.planId) return;

    this.plansService.getWorkloadAllocationReport(this.planId).subscribe({
      next: (res) => {
        const file = new Blob([res.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      error: () => {
        this.snackBarService.openSnackBar('Erro ao gerar PDF');
      },
    });
  }

  planIsSent(): boolean {
    return this.plan?.situation === EPlanSituation.SENT;
  }

  planIsPending(): boolean {
    return this.plan?.situation === EPlanSituation.PENDING;
  }

  submitPlan(): void {
    this.confirmDialogService
      .openDialog(`Deseja submeter o plano?`)
      .subscribe((confirm) => {
        if (confirm && this.planId) {
          this.plansService.submitPlan(this.planId).subscribe({
            next: () => {
              this.snackBarService.openSnackBar('Plano submetido com sucesso');
              this.getPlan(this.planId!);
            },
            error: () => {
              this.snackBarService.openSnackBar('Erro ao submeter plano');
            },
          });
        }
      });
  }

  cancelPlanSubmission(): void {
    this.confirmDialogService
      .openDialog(`Deseja cancelar a submissão do plano?`)
      .subscribe((confirm) => {
        if (confirm && this.planId) {
          this.plansService.cancelPlanSubmission(this.planId).subscribe({
            next: () => {
              this.snackBarService.openSnackBar(
                'Cancelada submissão do plano com sucesso'
              );
              this.getPlan(this.planId!);
            },
            error: () => {
              this.snackBarService.openSnackBar(
                'Erro ao cancelar submissão do plano'
              );
            },
          });
        }
      });
  }
}
