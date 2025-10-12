// src/app/services/vehicles-enquiry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface VehiclesEnquiry {
    _id: string;
    name: string;
    company: string;
    city: string;
    email: string;
    phone_number: string;
    message: string;
    brand: string;
    category: string;
    vehicle_details: string;
    buy_sell_rent: string;
    status: 'New' | 'In Progress' | 'Closed';
    enquiry_type: string;
    created_date: string;
    created_by: 'Guest' | 'User';

    // ⬇️ Admin-only fields
    loan?: 'yes' | 'no';
    bank_name?: string;
    loan_status?: 'initiated' | 'approved' | 'rejected';

    expected_delivery_date?: string;
    delivery_status?: 'pending' | 'in transit' | 'ready for delivery';
    delivery_location?: string;

    delivered_date?: string;
    customer_feedback?: string;
    delivery_proof?: string; // Could be a file name or URL

}


@Injectable({ providedIn: 'root' })
export class VehiclesEnquiryService {
    private baseUrl = API_ENDPOINTS.VehiclesEnquiry;

    constructor(private http: HttpClient) { }

    // ✅ Helper function to get whichever token exists
    private getAuthToken(apiType: 'user' | 'admin' | 'auto' = 'user'): string | null {
        const userToken = localStorage.getItem('user-token');
        const adminToken = localStorage.getItem('admin-token');
        console.log(adminToken)
        if (apiType === 'user') return userToken || null; // ✅ Only for user actions
        if (apiType === 'admin') return adminToken || null; // ✅ For admin APIs
        return userToken || adminToken || null; // auto fallback
    }

    private getUserToken(): string | null {
        return localStorage.getItem('user-token'); // only user token
    }

    // Create new enquiry
    createInquiry(data: VehiclesEnquiry): Observable<any> {
        const token = this.getUserToken();
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        // Strip admin-only fields if user/guest
        const adminOnlyFields: (keyof VehiclesEnquiry)[] = [
            'loan', 'bank_name', 'loan_status',
            'expected_delivery_date', 'delivery_status', 'delivery_location',
            'delivered_date', 'customer_feedback', 'delivery_proof'
        ];
        adminOnlyFields.forEach(f => delete data[f]);

        return this.http.post<any>(this.baseUrl, data, { headers });
    }


    getUserEnquiries(): Observable<VehiclesEnquiry[]> {
        const token = this.getAuthToken();
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return this.http.get<VehiclesEnquiry[]>(`${this.baseUrl}/my-enquiries`, { headers });
    }

    getAll(): Observable<VehiclesEnquiry[]> {
        const token = this.getAuthToken();
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return this.http.get<VehiclesEnquiry[]>(this.baseUrl, { headers });
    }

    updateStatus(id: string, status: string): Observable<any> {
        const token = this.getAuthToken();
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return this.http.put(`${this.baseUrl}/${id}`, { status }, { headers });
    }

    updateEnquiry(id: string, data: Partial<VehiclesEnquiry>): Observable<any> {
        const token = this.getAuthToken();
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return this.http.put(`${this.baseUrl}/${id}`, data, { headers });
    }
}

