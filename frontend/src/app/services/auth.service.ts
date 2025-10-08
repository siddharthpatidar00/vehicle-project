// // src/app/services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// @Injectable({
//     providedIn: 'root',
// })
// export class AuthService {
//     constructor(private router: Router) { }

//     // Save JWT token to localStorage
//     setToken(token: string): void {
//         localStorage.setItem('token', token);
//     }

//     // Retrieve JWT token from localStorage
//     getToken(): string | null {
//         return localStorage.getItem('token');
//     }

//     // Check if user is logged in
//     isLoggedIn(): boolean {
//         return this.getToken() !== null;
//     }

//     // Logout user
//     logout(): void {
//         localStorage.removeItem('token');
//         this.router.navigate(['/admin-login']);
//     }

//     // Decode JWT payload safely
//     private decodeToken(): any | null {
//         const token = this.getToken();
//         if (!token) return null;

//         try {
//             return JSON.parse(atob(token.split('.')[1]));
//         } catch (error) {
//             console.error('Failed to decode token', error);
//             return null;
//         }
//     }

//     // Extract user ID from token
// getUserId(): string | null {
//     const payload = this.decodeToken();
//     if (!payload) return null;
//     return payload.id || payload._id || null;
// }


//     // Extract user role from token
// getUserRole(): string | null {
//     const payload = this.decodeToken();
//     if (!payload) return null;
//     return payload.role || null; // Staff or Admin
// }
// }






// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AdminAuthService {
    private tokenKey = 'admin-token';

    constructor(private router: Router) { }

    // Save Admin token
    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    // Get Admin token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Check Admin login
    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    // Admin logout
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/admin-login']);
    }

    // Decode Admin token safely
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

    // Extract Admin role or ID
    getAdminId(): string | null {
        const payload = this.decodeToken();
        return payload ? payload.id || payload._id : null;
    }

    getAdminRole(): string | null {
        const payload = this.decodeToken();
        return payload ? payload.role : null;
    }
}
