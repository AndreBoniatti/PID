import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../auth/interfaces/IUserInfo';

@Component({
  standalone: false,

  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  userInfo?: IUserInfo | null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }

  logout(): void {
    this.authService.logout();
  }
}
