import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface HappyCustomer {
    _id?: string;
    name: string;
    message: string;
    image: string;
}

@Injectable({ providedIn: 'root' })
export class HappyCustomerService {
    private baseUrl = API_ENDPOINTS.HappyCustomer;

    constructor(private http: HttpClient) { }

    getAllCustomers(): Observable<HappyCustomer[]> {
        return this.http.get<HappyCustomer[]>(this.baseUrl);
    }

    createCustomer(data: FormData): Observable<HappyCustomer> {
        return this.http.post<HappyCustomer>(this.baseUrl, data);
    }

    updateCustomer(id: string, data: FormData): Observable<HappyCustomer> {
        return this.http.put<HappyCustomer>(`${this.baseUrl}/${id}`, data);
    }

    deleteCustomer(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}