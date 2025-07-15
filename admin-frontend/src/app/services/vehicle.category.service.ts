// src/app/services/vehicle-category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface VehicleCategory {
    _id?: string;
    category_name: string;
    category_description: string;
    category_image?: File | string;
    status: 'Active' | 'Inactive';
}

@Injectable({ providedIn: 'root' })
export class VehicleCategoryService {
    private baseUrl = API_ENDPOINTS.vehicleCategory;

    constructor(private http: HttpClient) { }

    getAll(): Observable<VehicleCategory[]> {
        return this.http.get<VehicleCategory[]>(this.baseUrl);
    }

    create(category: VehicleCategory): Observable<VehicleCategory> {
        const form = new FormData();
        form.append('category_name', category.category_name);
        form.append('category_description', category.category_description);
        form.append('status', category.status);

        if (category.category_image instanceof File) {
            form.append('category_image', category.category_image);
        }

        return this.http.post<VehicleCategory>(this.baseUrl, form);
    }

    update(id: string, category: VehicleCategory): Observable<any> {
        const form = new FormData();
        form.append('category_name', category.category_name);
        form.append('category_description', category.category_description);
        form.append('status', category.status);

        if (category.category_image instanceof File) {
            form.append('category_image', category.category_image);
        }

        return this.http.put(`${this.baseUrl}/${id}`, form);
    }


    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    updateStatus(id: string, status: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/status/${id}`, { status });
    }

    getById(id: string): Observable<VehicleCategory> {
        return this.http.get<VehicleCategory>(`${this.baseUrl}/${id}`);
    }
}
