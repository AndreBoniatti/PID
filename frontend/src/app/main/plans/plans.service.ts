import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IPlans } from './interfaces/IPlans';
import { IPlan } from './components/plan/interfaces/IPlan';
import { IActivityType } from './components/plan-activity/interfaces/IActivityType';
import {
  ICreatePlanActivity,
  ICreatePlanActivityResponse,
} from './components/plan-activity/interfaces/ICreatePlanActivity';
import { IUpdatePlanActivity } from './components/plan-activity/interfaces/IUpdatePlanActivity';

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

  getWorkloadAllocationReport(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/Plan/${id}/WorkloadAllocationReport`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getActivityTypes(): Observable<IActivityType[]> {
    return this.http.get<IActivityType[]>(`${BASE_URL}/ActivityType`);
  }

  postPlanActivity(
    planActivity: ICreatePlanActivity
  ): Observable<ICreatePlanActivityResponse> {
    return this.http.post<ICreatePlanActivityResponse>(
      `${BASE_URL}/PlanActivity`,
      planActivity
    );
  }

  putPlanActivity(
    id: string,
    planActivity: IUpdatePlanActivity
  ): Observable<any> {
    return this.http.put(`${BASE_URL}/PlanActivity/${id}`, planActivity);
  }

  deletePlanActivity(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/PlanActivity/${id}`);
  }
}
