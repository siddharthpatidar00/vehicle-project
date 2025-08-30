import { Routes } from '@angular/router';
import { VehicleListingComponent } from './vehicle-listing.component';

export const routes: Routes = [
    {
        path: '',
        component: VehicleListingComponent,
        data: {
            title: 'Vehicle Listing'
        }
    }
];


