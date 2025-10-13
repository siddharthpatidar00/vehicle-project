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
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AdminAuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;

        // Only attach admin token for admin APIs
        if (req.url.includes('/api')) {
            const token = this.auth.getToken();
            if (token) {
                authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }

        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                // Only logout admin on admin APIs
                if (err.status === 401 && req.url.includes('/api')) {
                    // this.auth.logout();
                }
                return throwError(() => err);
            })
        );
    }
}



