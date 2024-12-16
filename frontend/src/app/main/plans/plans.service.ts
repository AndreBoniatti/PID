import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IPlans } from './interfaces/IPlans';
import { IPlan } from './components/plan/interfaces/IPlan';

const BASE_URL = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IPlans[]> {
    return this.http.get<IPlans[]>(`${BASE_URL}/Plan`);
  }

  getById(id: string): Observable<IPlan> {
    return this.http.get<IPlan>(`${BASE_URL}/Plan/${id}`);
  }

  getHasPlanInLastPeriod(): Observable<boolean> {
    return this.http.get<boolean>(`${BASE_URL}/Plan/HasPlanInLastPeriod`);
  }
}
