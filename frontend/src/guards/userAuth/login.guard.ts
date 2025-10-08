// ✅ 2. login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from '../../app/services/user.auth.service';

@Injectable({ providedIn: 'root' })
export class UserLoginGuard implements CanActivate {
    constructor(private authService: UserAuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}