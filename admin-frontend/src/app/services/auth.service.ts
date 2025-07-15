import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private router: Router) { }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
    
     // ✅ Extract user ID from JWT payload
    getUserId(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload._id || payload.id || null; // adjust key name if backend sends it differently
        } catch (error) {
            console.error('Failed to decode token', error);
            return null;
        }
    }

}
