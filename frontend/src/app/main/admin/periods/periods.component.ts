import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { PeriodsService } from './periods.service';
import { IPeriod } from './interfaces/IPeriod';
import { CreatePeriodComponent } from './components/create-period/create-period.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  standalone: false,

  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css',
})
export class PeriodsComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['description', 'actions'];
  periods: IPeriod[] = [];

  constructor(
    private router: Router,
    private periodsService: PeriodsService,
    private confirmDialogService: ConfirmDialogService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getPeriods();
  }

  getPeriods(): void {
    this.periodsService.getAll().subscribe((periods) => {
      this.periods = periods;
    });
  }

  addPeriod(): void {
    const dialogRef = this.dialog.open(CreatePeriodComponent, {
      data: this.periods.map((x) => x.description),
    });
    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) this.getPeriods();
    });
  }

  viewPeriodPlans(period: IPeriod): void {
    this.router.navigateByUrl(`main/admin/period/${period.id}`);
  }

  deletePeriod(period: IPeriod): void {
    this.confirmDialogService
      .openDialog(`Deseja deletar o período: ${period.description}?`)
      .subscribe((confirm) => {
        if (confirm) {
          this.periodsService.deletePeriod(period.id).subscribe({
            next: () => {
              this.snackBarService.openSnackBar('Período deletado com sucesso');
              this.getPeriods();
            },
            error: () => {
              this.snackBarService.openSnackBar('Erro ao deletar período');
            },
          });
        }
      });
  }
}
