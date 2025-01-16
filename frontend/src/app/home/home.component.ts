import { Component, OnInit } from '@angular/core';

import { PeriodsService } from '../main/admin/periods/periods.service';
import { IPeriod } from '../main/admin/periods/interfaces/IPeriod';

@Component({
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  periods: IPeriod[] = [];

  constructor(private periodsService: PeriodsService) {}

  ngOnInit(): void {
    this.periodsService.getAll().subscribe((res) => (this.periods = res));
  }
}
