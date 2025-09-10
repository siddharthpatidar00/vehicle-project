import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';

export interface Contact {
    _id?: string; // Add ID for delete
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

    // Get all contacts
    getAllContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.baseUrl);
    }

    // Delete contact by ID
    deleteContact(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
