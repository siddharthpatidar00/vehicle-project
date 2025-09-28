import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

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

    getAllAds(): Observable<Advertisement[]> {
        return this.http.get<Advertisement[]>(this.baseUrl);
    }

    getAdByType(type: 'ad1' | 'ad2' | 'ad3'): Observable<Advertisement | undefined> {
        return new Observable((observer) => {
            this.getAllAds().subscribe({
                next: (ads) => {
                    const ad = ads.find(a => a.type === type && a.isActive);
                    observer.next(ad);
                    observer.complete();
                },
                error: (err) => observer.error(err)
            });
        });
    }
}
