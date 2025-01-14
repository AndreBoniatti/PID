import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../auth/interfaces/IUserInfo';

@Component({
  standalone: false,

  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  userInfo?: IUserInfo | null;
  userIsAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.userIsAdmin = this.authService.userIsAdmin(this.userInfo);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToHome(): void {
    this.router.navigateByUrl('main');
  }

  navigateToAdminArea(): void {
    this.router.navigateByUrl('main/admin');
  }
}
