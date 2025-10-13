import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';
import { map } from 'rxjs/operators';

export interface Insurance {
    fullName?: string;
    mobile?: string;
    policyNumber?: number;
    insuranceType?: string;
    vehicleDetail?: string;
    createdAt?: string
}

@Injectable({ providedIn: 'root' })
export class InsuranceService {
    private baseUrl = API_ENDPOINTS.Insurance;
    private tokenKey = 'user-token';

    constructor(private http: HttpClient) { }

    getAllInsurances(): Observable<Insurance[]> {
        return this.http.get<Insurance[]>(this.baseUrl);
    }

    createInsurance(data: Insurance): Observable<any> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token){
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post<any>(this.baseUrl, data, { headers });
    }

    getMyInsuranceInquiries(): Observable<Insurance[]> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.get<{ success: boolean, data: Insurance[] }>(`${this.baseUrl}/my-insurance-inquiries`, { headers })
            .pipe(
                map(res => res.data || [])
            );
    }
}