import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IPlanDialog } from './interfaces/IPlanDialog';

@Component({
  standalone: false,

  templateUrl: './plan-dialog.component.html',
  styleUrl: './plan-dialog.component.css',
})
export class PlanDialogComponent {
  data?: IPlanDialog = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<PlanDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
