import { Component, OnInit } from '@angular/core';

import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { PeriodsService } from './periods.service';
import { IPeriod } from './interfaces/IPeriod';

@Component({
  standalone: false,

  templateUrl: './periods.component.html',
  styleUrl: './periods.component.css',
})
export class PeriodsComponent implements OnInit {
  displayedColumns: string[] = ['description', 'actions'];
  periods: IPeriod[] = [];

  constructor(
    private periodsService: PeriodsService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getPeriods();
  }

  getPeriods(): void {
    this.periodsService.getAll().subscribe((periods) => {
      this.periods = periods;
    });
  }
}
