import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface PartialInsurance {
    fullName?: string;
    mobile?: string;
    policyNumber?: number;
    insuranceType?: string;
    vehicleDetail?: string;
}

@Injectable({ providedIn: 'root' })
export class InsuranceService {
    public baseUrl = API_ENDPOINTS.Insurance;

    constructor(private http: HttpClient) { }

    createInsurance(data: PartialInsurance): Observable<any> {
        return this.http.post(`${this.baseUrl}`, data);
    }
}
