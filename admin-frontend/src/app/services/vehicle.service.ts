// src/app/services/vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Vehicle {
    _id?: string;
    name: string;
    category_id: string;
    brand_id?: string;
    brand: string;
    model: string;
    km_driven?: number;
    description?: string;
    ownership: 'First' | 'Second' | 'Third' | 'Fourth+';
    manufacture_year: number;
    isInsured: boolean;
    insuranceValidTill?: string;
    price: number;
    status: 'Available' | 'Sold' | 'Rented' | 'Maintenance';
    sell_or_rent: 'Sell' | 'Rent';
    created_by: string;
    img?: string;
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private baseUrl = API_ENDPOINTS.vehicle;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(this.baseUrl);
    }

    getById(id: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
    }

    create(data: FormData): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    update(id: string, data: Partial<Vehicle>): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, data);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
