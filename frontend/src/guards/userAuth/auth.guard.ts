import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../app/shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (!this.authService.isLoggedIn()) {
            // If user is NOT logged in, redirect to login
            this.router.navigate(['/404']);
            return false;
        }
        // If logged in, allow access
        return true;
    }
}
