import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface User {
    id: string;
    _id?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    nickname?: string;
    dob?: Date;
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
    nickname?: string;
    status?: string;
    captcha: string;
    sessionCaptcha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = API_ENDPOINTS.LoginRegisterUser;
    private tokenKey = 'auth-token';
    private userSubject = new BehaviorSubject<User | null>(this.loadUser());
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    private loadUser(): User | null {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    }

    setUser(user: User | null) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        this.userSubject.next(user);
    }

    register(data: RegisterPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    login(data: LoginPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, data).pipe(
            tap((res: any) => {
                if (res.token) {
                    localStorage.setItem(this.tokenKey, res.token);
                    const user = { ...res.user, id: res.user.id || res.user._id || res.user.userId };
                    this.setUser(user);
                }
            })
        );
    }

    getUser(): User | null {
        return this.userSubject.value;
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.setUser(null);
    }

    updateProfile(userId: string, data: Partial<User>): Observable<any> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        const { email, ...updatableData } = data;

        return this.http.put(`${this.baseUrl}/${userId}`, updatableData, { headers }).pipe(
            tap((res: any) => {
                if (res.user) {
                    this.setUser(res.user);
                }
            })
        );
    }

    getProfile(userId: string): Observable<User> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.get<User>(`${this.baseUrl}/${userId}`, { headers }).pipe(
            tap((user: any) => {
                const normalizedUser = { ...user, id: user.id || user._id || user.userId };
                this.setUser(normalizedUser);
            })
        );
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return this.http.put(
            `${this.baseUrl}/change-password`,
            { currentPassword, newPassword },
            { headers }
        );
    }
}
