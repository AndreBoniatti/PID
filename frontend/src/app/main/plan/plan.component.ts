import { Component } from '@angular/core';

import { IPlan } from './interfaces/IPlan';

@Component({
  standalone: false,

  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css',
})
export class PlanComponent {
  displayedColumns: string[] = ['atividade', 'ch', 'actions'];
  plans: IPlan[] = [
    {
      atividade: 'Algoritmos I',
      ch: 20,
    },
    {
      atividade: 'Engenharia de Software I',
      ch: 20,
    },
  ];
}
