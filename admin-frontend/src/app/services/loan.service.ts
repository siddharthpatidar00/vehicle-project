import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Loan {
    fullName?: string;
    email?: string;
    mobile?: string;
    loanAmount?: number;
    tenure?: number;
    annualIncome?: number;
    vehicleDetail?: string;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
    private baseUrl = API_ENDPOINTS.Loan;

    constructor(private http: HttpClient) { }

    getAllLoanInquiries(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.baseUrl);
    }
}