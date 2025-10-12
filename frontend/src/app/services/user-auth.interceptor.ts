// src/app/services/user-auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user.auth.service';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
    constructor(private userAuth: UserAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only attach token for non-admin routes
        if (!req.url.includes('/api/admin') && req.url.includes('/api/user') || !req.url.includes('/api/admin')) {
            const token = this.userAuth.getToken();
            if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        }

        return next.handle(req);
    }
}
