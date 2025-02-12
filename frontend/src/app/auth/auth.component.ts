import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,

  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    (window as any).handleCredentialResponse = (response: any) => {
      this.handleCredentialResponse(response);
    };
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;

    this.authService.authenticateWithGoogle(idToken).subscribe((res) => {
      this.authService.setToken(res.token);
      this.router.navigateByUrl(
        this.authService.userIsAdmin(null) ? 'main/admin' : 'main'
      );
    });
  }
}
