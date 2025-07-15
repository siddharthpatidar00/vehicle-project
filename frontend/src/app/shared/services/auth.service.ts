import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
    password: string;
    mobile?: string;
    company?: string;
    gst?: string;
    pan?: string;
    dob?: Date;
    aadhar?: string;
    city?: string;
    address?: string;
    status?: string;
    captcha: string;      
    sessionCaptcha: string;  
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = API_ENDPOINTS.LoginRegisterUser;
    private tokenKey = 'auth-token';

    constructor(private http: HttpClient) { }

    // ✅ Register user (with captcha)
    register(data: RegisterPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    // ✅ Login user
    login(data: LoginPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, data).pipe(
            tap((res: any) => {
                if (res.token) {
                    localStorage.setItem(this.tokenKey, res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                }
            })
        );
    }


    // ✅ Get logged-in user
    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // ✅ Check if user is logged in
    isLoggedIn(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    // ✅ Logout
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('user');
    }
}
