import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

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
}