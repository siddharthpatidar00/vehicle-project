import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';
import { map } from 'rxjs/operators';

export interface Loan {
    fullName?: string;
    email?: string;
    mobile?: string;
    loanAmount?: number;
    tenure?: number;
    annualIncome?: number;
    vehicleDetail?: string;
    createdAt?: string
}

@Injectable({ providedIn: 'root' })
export class LoanService {
    private baseUrl = API_ENDPOINTS.Loan;
    private tokenKey = 'user-token';

    constructor(private http: HttpClient) { }

    getAllLoanInquiries(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.baseUrl);
    }

    createLoanInquiry(data: Loan): Observable<any> {
        const token = localStorage.getItem(this.tokenKey)
        let headers = new HttpHeaders()
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`)
        }
        return this.http.post<any>(this.baseUrl, data, { headers });
    }


    getMyLoanInquiries(): Observable<Loan[]> {
        const token = localStorage.getItem(this.tokenKey);
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.get<{ success: boolean, data: Loan[] }>(`${this.baseUrl}/my-inquiries`, { headers })
            .pipe(
                map(res => res.data || [])
            );
    }

}

