// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private router: Router) { }

    // Save JWT token to localStorage
    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    // Retrieve JWT token from localStorage
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    // Logout user
    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/admin-login']);
    }

    // Decode JWT payload safely
    private decodeToken(): any | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Failed to decode token', error);
            return null;
        }
    }

    // Extract user ID from token
getUserId(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;
    return payload.id || payload._id || null;
}


    // Extract user role from token
getUserRole(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;
    return payload.role || null; // Staff or Admin
}
}
