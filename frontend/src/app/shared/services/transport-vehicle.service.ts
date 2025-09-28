import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface PartialTransportVehicle {
    name?: string | null;
    pickup_location?: string | null;
    drop_location?: string | null;
    phone_number?: string | null;
    vehicle_detail?: string | null;
    shifting_date?: string | null;
    status?: string | null;
    created_date?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TransportVehicleService {
    private baseUrl = API_ENDPOINTS.TransportVehicle;
    private tokenKey = 'auth-token';

    constructor(private http: HttpClient) { }


createTransport(data:PartialTransportVehicle): Observable<any>{
    const token = localStorage.getItem(this.tokenKey)
    let headers = new HttpHeaders()
    if (token) {
        headers = headers.set('Authorization',`Bearer ${token}`)
    }
    return this.http.post<any>(this.baseUrl,data,{headers})
}

    getMyTransports(): Observable<PartialTransportVehicle[]> {
        const token = localStorage.getItem('auth-token');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`); // same as getUserEnquiries
        }

        return this.http.get<PartialTransportVehicle[]>(`${this.baseUrl}/my-transports`, { headers });
    }



}
