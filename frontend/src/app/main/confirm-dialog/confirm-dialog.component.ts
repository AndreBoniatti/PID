import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IConfirmDialog } from './interfaces/IConfirmDialog';

@Component({
  standalone: false,

  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  data?: IConfirmDialog = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    this.dialogRef.disableClose = true;
  }

  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
