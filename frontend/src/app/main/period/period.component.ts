import { Component } from '@angular/core';

import { PeriodService } from './period.service';

@Component({
  standalone: false,

  templateUrl: './period.component.html',
  styleUrl: './period.component.css',
})
export class PeriodComponent {
  constructor(private periodService: PeriodService) {}

  test(): void {
    this.periodService.getAll().subscribe((periods) => {
      console.log(periods);
    });
  }
}
