// src/app/services/transport-vehicle.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export type TransportStatus = 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';

export interface TransportVehicle {
    _id?: string;
    pickup_location: string | null | undefined;
    drop_location: string | null | undefined;
    name: string | null | undefined;
    phone_number: string | null | undefined;
    shifting_date: string | null | undefined;
    vehicle_detail: string | null | undefined;
    status?: TransportStatus | null | undefined;
    created_date?: string | null | undefined;
}

@Injectable({ providedIn: 'root' })
export class TransportVehicleService {
    private baseUrl = API_ENDPOINTS.TransportVehicle;
    private tokenKey = 'auth-token';
    constructor(private http: HttpClient) { }

    getAllTransports(): Observable<TransportVehicle[]> {
        return this.http.get<TransportVehicle[]>(this.baseUrl);
    }

    updateTransport(id: string, data: Partial<TransportVehicle>): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, data);
    }

    deleteTransport(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    createTransport(data: TransportVehicle): Observable<any> {
        const token = localStorage.getItem(this.tokenKey)
        let headers = new HttpHeaders()
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`)
        }
        return this.http.post<any>(this.baseUrl, data, { headers })
    }

    getMyTransports(): Observable<TransportVehicle[]> {
        const token = localStorage.getItem('auth-token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`); // same as getUserEnquiries
        }

        return this.http.get<TransportVehicle[]>(`${this.baseUrl}/my-transports`, { headers });
    }
}
