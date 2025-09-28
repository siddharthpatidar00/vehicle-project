import { Routes } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details.component';

export const routes: Routes = [
    {
        path: ':id', 
        component: VehicleDetailsComponent,
        data: {
            title: 'Vehicle Detail'
        }
    }
];
