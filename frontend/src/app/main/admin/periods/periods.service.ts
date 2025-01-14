import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IPeriod } from './interfaces/IPeriod';

const BASE_URL = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PeriodsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IPeriod[]> {
    return this.http.get<IPeriod[]>(`${BASE_URL}/Period`);
  }
}
