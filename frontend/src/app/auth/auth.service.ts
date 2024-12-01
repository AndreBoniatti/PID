import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IAuthToken } from './interfaces/IAuthToken';
import { LocalStorageService } from '../shared/services/local-storage.service';

const BASE_URL = environment.api;
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  authenticateWithGoogle(idToken: string): Observable<IAuthToken> {
    return this.http.post<IAuthToken>(`${BASE_URL}/auth/google`, {
      idToken,
    });
  }

  setToken(token: string): void {
    this.localStorageService.setItem(TOKEN_KEY, token);
  }

  getToken(): string {
    return this.localStorageService.getItem(TOKEN_KEY);
  }
}
