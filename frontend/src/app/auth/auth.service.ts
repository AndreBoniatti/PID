import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../environments/environment';
import { IAuthToken } from './interfaces/IAuthToken';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { IUserInfo } from './interfaces/IUserInfo';
import { EUserType } from './enums/EUserType';

const BASE_URL = environment.api;
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  authenticateWithGoogle(idToken: string): Observable<IAuthToken> {
    return this.http.post<IAuthToken>(`${BASE_URL}/Auth/Google`, {
      idToken,
    });
  }

  setToken(token: string): void {
    this.localStorageService.setItem(TOKEN_KEY, token);
  }

  getToken(): string {
    return this.localStorageService.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    this.localStorageService.removeItem(TOKEN_KEY);
  }

  logout(): void {
    this.removeToken();
    this.router.navigateByUrl('');

    setTimeout(() => {
      location.reload();
    });
  }

  getUserInfo(): IUserInfo | null {
    const token = this.getToken();

    if (token) {
      try {
        const decoded = jwtDecode<IUserInfo>(token);
        return decoded;
      } catch (error) {
        console.error('Erro ao decodificar o token JWT:', error);
        return null;
      }
    } else {
      return null;
    }
  }

  userIsAdmin(userInfo: IUserInfo | null): boolean {
    if (!userInfo) userInfo = this.getUserInfo();
    return userInfo?.type.toString() === EUserType.ADMIN.toString();
  }
}
