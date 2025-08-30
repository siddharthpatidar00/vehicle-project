import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface SellVehicle {
    name?: string | null;
    model?: string | null;
    brand?: string | null;
    category?: string | null;
    category_name: string;
    km_driven?: number;
    ownership?: 'First' | 'Second' | 'Third' | 'Fourth+';
    manufacture_year?: number;
    price?: number;
    isInsured?: boolean;
    insuranceValidTill?: string;
    sell_or_rent?: 'Sell' | 'Rent';
    phone?: string | null;
    img?: File | null;
    status?: 'Inactive' | 'Available' | 'Sold' | 'Rented' | 'Maintenance';
    description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SellVehicleService {
    private baseUrl = API_ENDPOINTS.sellVehicle;

    constructor(private http: HttpClient) { }

    createVehicle(data: FormData): Observable<any> {
        const token = localStorage.getItem('auth-token');
        return this.http.post<any>(this.baseUrl, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

}
