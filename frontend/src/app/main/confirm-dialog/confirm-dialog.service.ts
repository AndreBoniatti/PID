import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { IConfirmDialog } from './interfaces/IConfirmDialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  readonly dialog = inject(MatDialog);

  openDialog(
    message: string,
    confirmAction = 'Confirmar',
    cancellAction = 'Cancelar'
  ): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: message,
          confirmAction: confirmAction,
          cancellAction: cancellAction,
        } as IConfirmDialog,
      })
      .afterClosed();
  }
}
