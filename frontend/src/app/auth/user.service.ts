import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const BASE_URL = environment.api;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getWorkload(): Observable<number> {
    return this.http.get<number>(`${BASE_URL}/User/Workload`);
  }
}
