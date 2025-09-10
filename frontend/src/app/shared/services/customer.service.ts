// src/app/shared/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface Customer {
    _id?: string;
    name: string;
    message: string;
    image: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private baseUrl = API_ENDPOINTS.Customer; 

    constructor(private http: HttpClient) { }

    getAllCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.baseUrl);
    }
}
