import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

@Injectable({ providedIn: 'root' })
export class VehicleCategoryService {
    private baseUrl = API_ENDPOINTS.VehicleCategory;

    constructor(private http: HttpClient) { }

    getAllCategories(): Observable<any> {
        return this.http.get<any>(this.baseUrl);
    }
}
