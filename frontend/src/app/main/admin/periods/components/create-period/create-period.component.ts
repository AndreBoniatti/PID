import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { PeriodsService } from '../../periods.service';

@Component({
  standalone: false,

  templateUrl: './create-period.component.html',
  styleUrl: './create-period.component.css',
})
export class CreatePeriodComponent implements OnInit {
  data?: string[] = inject(MAT_DIALOG_DATA);

  year = 0;
  semester = 1;

  constructor(
    private dialogRef: MatDialogRef<CreatePeriodComponent>,
    private periodsService: PeriodsService,
    private snackBarService: SnackBarService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const currentDate = new Date();

    this.year = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;
    this.semester = currentMonth >= 1 && currentMonth <= 6 ? 1 : 2;
  }

  periodIsInvalid(): boolean {
    return (
      this.data?.some((x) => x === `${this.year} / ${this.semester}`) ?? false
    );
  }

  savePeriod(): void {
    this.periodsService
      .createPeriod({
        year: this.year,
        semester: this.semester,
      })
      .subscribe({
        next: () => {
          this.snackBarService.openSnackBar('Período salvo com sucesso');
          this.close(true);
        },
        error: () => {
          this.snackBarService.openSnackBar('Erro ao salvar período');
        },
      });
  }

  close(saved?: boolean): void {
    this.dialogRef.close(saved);
  }
}
