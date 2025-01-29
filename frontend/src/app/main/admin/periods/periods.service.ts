import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IPeriod } from './interfaces/IPeriod';
import { ICreatePeriod } from './components/create-period/interfaces/ICreatePeriod';
import { IPeriodPlan } from './components/period-plans/interfaces/IPeriodPlan';
import { EPlanSituation } from '../../plans/enums/EPlanSituation';
import { IAggregatedPlans } from '../../../home/aggregated-plans-report/interfaces/IAggregatedPlans';

const BASE_URL = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PeriodsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IPeriod[]> {
    return this.http.get<IPeriod[]>(`${BASE_URL}/Period`);
  }

  getById(id: string): Observable<IPeriod> {
    return this.http.get<IPeriod>(`${BASE_URL}/Period/${id}`);
  }

  getApprovedPeriodPlans(id: string): Observable<IPeriodPlan[]> {
    return this.http.get<IPeriodPlan[]>(
      `${BASE_URL}/Period/${id}/ApprovedPlans`
    );
  }

  getAggregatedPeriodPlans(
    id: string,
    activityTypeId?: string
  ): Observable<IAggregatedPlans[]> {
    let url = `${BASE_URL}/Period/${id}/AggregatedPlans`;

    if (activityTypeId) url += `?activityTypeId=${activityTypeId}`;

    return this.http.get<IAggregatedPlans[]>(url);
  }

  getPeriodPlans(
    id: string,
    planSituation: EPlanSituation,
    userName?: string
  ): Observable<IPeriodPlan[]> {
    let url = `${BASE_URL}/Period/${id}/Plans?planSituation=${planSituation}`;

    if (userName) url += `&userName=${userName}`;

    return this.http.get<IPeriodPlan[]>(url);
  }

  createPeriod(data: ICreatePeriod): Observable<any> {
    return this.http.post(`${BASE_URL}/Period`, data);
  }

  deletePeriod(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/Period/${id}`);
  }
}
