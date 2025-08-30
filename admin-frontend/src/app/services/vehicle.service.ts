import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';
import { AuthService } from './auth.service';

export interface Vehicle {
    _id?: string;
    name: string;
    category_id: string;
    category_name: string;
    brand_id?: string;
    brand: string;
    model: string;
    km_driven?: number;
    description?: string;
    ownership: 'First' | 'Second' | 'Third' | 'Fourth+';
    manufacture_year: number;
    isInsured: boolean;
    phone: string;
    insuranceValidTill?: string;
    price: number;
    status: 'Available' | 'Sold' | 'Rented' | 'Maintenance' | 'Inactive';
    sell_or_rent: 'Sell' | 'Rent';
    createdBy: string;
    img?: string[];
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private baseUrl = API_ENDPOINTS.vehicle;

    constructor(
        private http: HttpClient,
        private authService: AuthService   // <-- inject here
    ) { }

    getAll(showAll: boolean = false): Observable<Vehicle[]> {
        const url = showAll ? `${this.baseUrl}?showAll=true` : this.baseUrl;
        return this.http.get<Vehicle[]>(url);
    }

    getById(id: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
    }

    create(data: FormData): Observable<any> {
        const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
        return this.http.post(this.baseUrl, data, { headers });
    }

    update(id: string, data: Partial<Vehicle>): Observable<any> {
        const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
        return this.http.put(`${this.baseUrl}/${id}`, data, { headers });
    }

    delete(id: string): Observable<any> {
        const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
        return this.http.delete(`${this.baseUrl}/${id}`, { headers });
    }
}
