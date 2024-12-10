import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PeriodService } from './period.service';
import { IPeriod } from './interfaces/IPeriod';
import { getPlanSituationDescription } from '../plan/enums/EPlanSituation';

@Component({
  standalone: false,

  templateUrl: './period.component.html',
  styleUrl: './period.component.css',
})
export class PeriodComponent implements OnInit {
  displayedColumns: string[] = ['description', 'situation', 'actions'];
  periods: IPeriod[] = [];

  constructor(private periodService: PeriodService, private router: Router) {}

  ngOnInit(): void {
    this.getPeriods();
  }

  getPeriods(): void {
    this.periodService.getAll().subscribe((periods) => {
      console.log(periods);
      this.periods = periods;
    });
  }

  getSituation(situation: number): string {
    return getPlanSituationDescription(situation);
  }

  viewPlan(): void {
    this.router.navigateByUrl('main/plan');
  }
}
