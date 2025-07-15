import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Staff {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_type: string;
    status?: string;
}

@Injectable({ providedIn: 'root' })
export class StaffService {
    private baseUrl = API_ENDPOINTS.staff;

    constructor(private http: HttpClient) { }

    createStaff(data: Staff): Observable<Staff> {
        return this.http.post<Staff>(this.baseUrl, data);
    }

    getAllStaff(): Observable<Staff[]> {
        return this.http.get<Staff[]>(this.baseUrl);
    }

    // ... you can add updateStaff, deleteStaff here if needed
}
