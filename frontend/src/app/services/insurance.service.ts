import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

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

    constructor(private http: HttpClient) { }

    getAllInsurances(): Observable<Insurance[]> {
        return this.http.get<Insurance[]>(this.baseUrl);
    }

    createInsurance(data: Insurance): Observable<any> {
            return this.http.post(`${this.baseUrl}`, data);
        }
}