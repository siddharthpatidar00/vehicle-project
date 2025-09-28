import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';

export interface Contact {
    firstName: string;
    lastName?: string;
    mobile: string;
    email: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
    private baseUrl = API_ENDPOINTS.Contact;

    constructor(private http: HttpClient) { }

    // POST new contact message
    submitContact(contact: Contact): Observable<any> {
        return this.http.post<any>(this.baseUrl, contact);
    }
}
