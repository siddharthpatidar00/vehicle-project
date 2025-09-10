import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Advertisement {
    _id: string;
    type: 'ad1' | 'ad2' | 'ad3';
    image: string;
    imageTitle: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
}

@Injectable({ providedIn: 'root' })
export class AdvertisementService {
    private baseUrl = API_ENDPOINTS.Advertisement;

    constructor(private http: HttpClient) { }

    // READ
    getAllAds(): Observable<Advertisement[]> {
        return this.http.get<Advertisement[]>(this.baseUrl);
    }

    getAdById(id: string): Observable<Advertisement> {
        return this.http.get<Advertisement>(`${this.baseUrl}/${id}`);
    }

    // CREATE
    createAd(formData: FormData): Observable<any> {
        return this.http.post(this.baseUrl, formData);
    }

    // UPDATE
    updateAd(id: string, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, formData);
    }

    // DELETE
    deleteAd(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
