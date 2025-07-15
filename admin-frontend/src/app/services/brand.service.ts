// src/app/services/brand.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Brand {
    _id?: string;
    brand_name: string;
    brand_description: string;
    status: 'Active' | 'Inactive';
    brand_image?: File | string;
}

@Injectable({ providedIn: 'root' })
export class BrandService {
    private baseUrl = API_ENDPOINTS.vehicleBrand; 

    constructor(private http: HttpClient) { }

    getAll(): Observable<Brand[]> {
        return this.http.get<Brand[]>(this.baseUrl);
    }

    getById(id: string): Observable<Brand> {
        return this.http.get<Brand>(`${this.baseUrl}/${id}`);
    }

    create(brand: Brand): Observable<Brand> {
        const form = new FormData();
        form.append('brand_name', brand.brand_name);
        form.append('brand_description', brand.brand_description);
        form.append('status', brand.status);
        if (brand.brand_image instanceof File) {
            form.append('brand_image', brand.brand_image);
        }
        return this.http.post<Brand>(this.baseUrl, form);
    }

    update(id: string, brand: Brand): Observable<Brand> {
        const form = new FormData();
        form.append('brand_name', brand.brand_name);
        form.append('brand_description', brand.brand_description);
        form.append('status', brand.status);
        if (brand.brand_image instanceof File) {
            form.append('brand_image', brand.brand_image);
        }
        return this.http.put<Brand>(`${this.baseUrl}/${id}`, form);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    toggleStatus(id: string, status: 'Active' | 'Inactive') {
        return this.http.put(`${this.baseUrl}/${id}/status`, { status });
    }

}
