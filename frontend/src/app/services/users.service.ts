import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface User {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
    password: string;
    mobile?: string;
    company?: string;
    gst?: string;
    pan?: string;
    dob?: string;
    aadhar?: string;
    city?: string;
    address?: string;
    status?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    // Assuming API_ENDPOINTS.users = '/api/users'
    private baseUrl = API_ENDPOINTS.users;

    constructor(private http: HttpClient) { }

    // Public
    register(user: Partial<User>): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/register`, user);
    }
    verifyOtp(payload: { userId: string; otp: string }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/verify-otp`, payload);
    }
    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, credentials);
    }

    // Protected (you’ll need to add an HTTP interceptor to send your JWT)
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }
    getById(id: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }
    update(id: string, changes: Partial<User>): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, changes);
    }
    delete(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }
}
