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

  situationWasChanged(situationWasChanged: boolean): void {
    if (situationWasChanged) this.close(situationWasChanged);
  }

  close(situationWasChanged?: boolean): void {
    this.dialogRef.close(situationWasChanged);
  }
}
