import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private baseUrl = API_ENDPOINTS.Filter;

    constructor(private http: HttpClient) { }

    // GET method for fetching filters
    getFilters(): Observable<any> {
        return this.http.get<any>(this.baseUrl);
    }

    // Example: if you need to apply filter with params
    getFilteredVehicles(params: any): Observable<any> {
        return this.http.get<any>(this.baseUrl, { params });
    }
}
