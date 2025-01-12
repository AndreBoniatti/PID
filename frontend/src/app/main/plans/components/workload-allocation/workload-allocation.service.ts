import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPlanActivityTable } from '../plan-activity/interfaces/IPlanActivityTable';

@Injectable({
  providedIn: 'root',
})
export class WorkloadAllocationService {
  private planActivityTable$ = new BehaviorSubject<IPlanActivityTable>({
    userWorkload: 0,
    planActivities: [],
  });

  getPlanActivityTable(): Observable<IPlanActivityTable> {
    return this.planActivityTable$.asObservable();
  }

  setPlanActivityTable(data: IPlanActivityTable): void {
    this.planActivityTable$.next(data);
  }
}
