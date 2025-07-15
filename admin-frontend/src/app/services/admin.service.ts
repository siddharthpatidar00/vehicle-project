import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/login`, { email, password });
    }
}
