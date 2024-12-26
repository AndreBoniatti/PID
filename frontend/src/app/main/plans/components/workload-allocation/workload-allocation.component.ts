import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-workload-allocation',

  templateUrl: './workload-allocation.component.html',
  styleUrl: './workload-allocation.component.css',
})
export class WorkloadAllocationComponent implements OnInit {
  @Input() preSelectedPairs?: string[] = [];
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  times = Array.from({ length: 13 }, (_, i) => i + 1);
  selectedSlots: boolean[][] = [];

  constructor() {
    this.selectedSlots = this.times.map(() => this.days.map(() => false));
  }

  ngOnInit(): void {
    this.preSelectedPairs?.forEach((pair) => {
      const [rowStr, colStr] = pair.split('/');
      const row = +rowStr;
      const col = +colStr;

      if (
        row >= 0 &&
        row < this.times.length &&
        col >= 0 &&
        col < this.days.length
      ) {
        this.selectedSlots[row][col] = true;
      }
    });
  }

  toggleSelection(i: number, j: number) {
    this.selectedSlots[i][j] = !this.selectedSlots[i][j];
  }

  isSelected(i: number, j: number): boolean {
    return this.selectedSlots[i][j];
  }

  getSelectedPairs(): string[] {
    const selectedPairs: string[] = [];
    for (let i = 0; i < this.selectedSlots.length; i++) {
      for (let j = 0; j < this.selectedSlots[i].length; j++) {
        if (this.selectedSlots[i][j]) {
          selectedPairs.push(`${i}/${j}`);
        }
      }
    }

    return selectedPairs;
  }
}
