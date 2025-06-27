import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private auth: AuthService) { }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return false;
        }
        return true;
    }
}
