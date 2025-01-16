import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IPeriod } from './interfaces/IPeriod';
import { ICreatePeriod } from './components/create-period/interfaces/ICreatePeriod';
import { IPagedList } from '../../../shared/interfaces/IPagedList';
import { IPeriodPlan } from './components/period-plans/interfaces/IPeriodPlan';
import { EPlanSituation } from '../../plans/enums/EPlanSituation';

const BASE_URL = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PeriodsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IPeriod[]> {
    return this.http.get<IPeriod[]>(`${BASE_URL}/Period`);
  }

  getApprovedPeriodPlans(
    id: string,
    pageIndex = 0,
    pageSize = 5
  ): Observable<IPagedList<IPeriodPlan>> {
    return this.http.get<IPagedList<IPeriodPlan>>(
      `${BASE_URL}/Period/${id}/ApprovedPlans?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  getPeriodPlans(
    id: string,
    pageIndex = 0,
    pageSize = 5,
    userName?: string,
    planSituation?: EPlanSituation
  ): Observable<IPagedList<IPeriodPlan>> {
    let url = `${BASE_URL}/Period/${id}/Plans?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    if (userName) url += `&userName=${userName}`;
    if (planSituation || planSituation === 0)
      url += `&planSituation=${planSituation}`;

    return this.http.get<IPagedList<IPeriodPlan>>(url);
  }

  createPeriod(data: ICreatePeriod): Observable<any> {
    return this.http.post(`${BASE_URL}/Period`, data);
  }

  deletePeriod(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/Period/${id}`);
  }
}
