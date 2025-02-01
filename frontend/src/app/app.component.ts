import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IUserInfo } from './auth/interfaces/IUserInfo';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  userInfo?: IUserInfo | null;
  userIsAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthenticatedUser().subscribe((res) => {
      if (res) {
        this.userInfo = res;
        this.userIsAdmin = this.authService.userIsAdmin(this.userInfo);
      }
    });

    this.userInfo = this.authService.getUserInfo();
    this.userIsAdmin = this.authService.userIsAdmin(this.userInfo);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToHome(): void {
    this.router.navigateByUrl(
      !this.userInfo ? '' : this.userIsAdmin ? 'main/admin' : 'main'
    );
  }
}
