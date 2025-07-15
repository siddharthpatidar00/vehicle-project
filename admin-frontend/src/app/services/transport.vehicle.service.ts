// src/app/services/transport-vehicle.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export type TransportStatus = 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';

export interface TransportVehicle {
    _id?: string;
    pickup_location: string;
    drop_location: string;
    name: string;
    phone_number: string;
    shifting_date: string;
    vehicle_detail: string;
    status?: TransportStatus;
    created_date?: string;
}

@Injectable({ providedIn: 'root' })
export class TransportVehicleService {
    private baseUrl = API_ENDPOINTS.TransportVehicle;

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
}
