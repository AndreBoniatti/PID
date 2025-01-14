import { Component } from '@angular/core';

import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';

@Component({
  standalone: false,

  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css',
})
export class PeriodsComponent {
  constructor(private confirmDialogService: ConfirmDialogService) {}
}
