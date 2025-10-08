import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminAuthService } from '../../app/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private auth: AdminAuthService) { }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return false;
        }
        return true;
    }
}
