// src/app/services/admin-auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminAuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
    constructor(private auth: AdminAuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only attach token for admin routes
        if (req.url.includes('/api/admin-dashboard')) {
            const token = this.auth.getToken();
            if (token) {
                req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            }
        }

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.auth.logout();
                }
                return throwError(() => err);
            })
        );
    }
}
