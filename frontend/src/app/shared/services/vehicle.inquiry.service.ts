import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface PartialVehicleInquiry {
    name?: string | null;
    company?: string | null;
    city?: string | null;
    email?: string | null;
    phone_number?: string | null;
    brand?: string | null;
    category?: string | null;
    vehicle_details?: string | null;
    buy_sell_rent: 'Buy' | 'Sell' | 'Rent';
    enquiry_type: 'Individual' | 'Company';
    message?: string | null;
}

@Injectable({ providedIn: 'root' })
export class VehicleInquiryService {
    private baseUrl = API_ENDPOINTS.VehicleInquiry;
    private tokenKey = 'auth-token';

    constructor(private http: HttpClient) { }

    createInquiry(data: PartialVehicleInquiry): Observable<any> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post<any>(this.baseUrl, data, { headers });
    }
}
