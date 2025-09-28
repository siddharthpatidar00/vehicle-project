import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface PartialLoanInquiry {
    fullName?: string;
    email?: string;
    mobile?: string;
    loanAmount?: number;
    tenure?: number;
    annualIncome?: number;
    vehicleDetail?: string;
}

@Injectable({ providedIn: 'root' })
export class LoanInquiryService {
    public baseUrl = API_ENDPOINTS.LoanInquiry;

    constructor(private http: HttpClient) { }

    // Create Loan Inquiry
    createLoanInquiry(data: PartialLoanInquiry): Observable<any> {
        return this.http.post(`${this.baseUrl}`, data);
    }
}
