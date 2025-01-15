import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,

  templateUrl: './reject-plan-dialog.component.html',
  styleUrl: './reject-plan-dialog.component.css',
})
export class RejectPlanDialogComponent {
  readonly dialog = inject(MatDialog);

  reason = '';

  constructor(private dialogRef: MatDialogRef<RejectPlanDialogComponent>) {
    this.dialogRef.disableClose = true;
  }

  close(confirmRejection: boolean): void {
    this.dialogRef.close(confirmRejection ? this.reason : null);
  }
}
