// src/app/services/vehicles-enquiry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    getAll(): Observable<VehiclesEnquiry[]> {
        return this.http.get<VehiclesEnquiry[]>(this.baseUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    }

    updateStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    }

    updateEnquiry(id: string, data: Partial<VehiclesEnquiry>): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    }

}
