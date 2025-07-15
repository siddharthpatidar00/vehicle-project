import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {
    private modalSubject = new Subject<void>();
    openModal$ = this.modalSubject.asObservable();
    private locationNameSubject = new BehaviorSubject<string>('Location');
    locationName$ = this.locationNameSubject.asObservable();
    constructor() { }
    triggerModal() {
        this.modalSubject.next();
    }
    setLocation(name: string) {
        this.locationNameSubject.next(name);
    }
}
