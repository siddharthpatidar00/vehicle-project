import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';
import { Vehicle } from '../services/vehicle.service';

@Injectable({ providedIn: 'root' })
export class VehicleListingService {
    private baseUrl = API_ENDPOINTS.VehicleListing;

    constructor(private http: HttpClient) { }

    getAllVehicles(filter?: {
        category_name?: string;
        category_id?: string;
        brand_name?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Observable<Vehicle[]> {
        let url = this.baseUrl;
        const params: string[] = [];

        if (filter?.category_id) params.push(`category_id=${encodeURIComponent(filter.category_id)}`);
        if (filter?.category_name) params.push(`category_name=${encodeURIComponent(filter.category_name)}`);
        if (filter?.brand_name) params.push(`brand=${encodeURIComponent(filter.brand_name)}`);
        if (filter?.minPrice !== undefined) params.push(`minPrice=${filter.minPrice}`);
        if (filter?.maxPrice !== undefined) params.push(`maxPrice=${filter.maxPrice}`);

        if (params.length) url += `?${params.join('&')}`;

        return this.http.get<Vehicle[]>(url);
    }

    getVehicleById(id: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
    }

    getVehicleByName(name: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.baseUrl}/by-name/${encodeURIComponent(name)}`);
    }

    getVehiclesByUserId(userId: string): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.baseUrl}/user/${userId}`);
    }

}
