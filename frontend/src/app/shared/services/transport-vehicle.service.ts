import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config'


export interface PartialTransportVehicle {
    name?: string | null;
    pickup_location?: string | null;
    drop_location?: string | null;
    phone_number?: string | null;
    vehicle_detail?: string | null;
    shifting_date?: string | null;
    status?: string | null;
}


@Injectable({ providedIn: 'root' })
export class TransportVehicleService {
    private baseUrl = API_ENDPOINTS.TransportVehicle;

    constructor(private http: HttpClient) { }

    createTransport(data: PartialTransportVehicle): Observable<PartialTransportVehicle> {
        return this.http.post<PartialTransportVehicle>(this.baseUrl, data);
    }

}
