import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Vehicle Management'
        },
        children: [
            {
                path: '',
                redirectTo: 'vehicles',
                pathMatch: 'full'
            },
            {
                path: 'vehicles',
                loadComponent: () => import('../vehicle-management/vehicles/vehicles.component').then(m => m.VehiclesComponent),
                data: {
                    title: 'Vehicles'
                }
            },
            {
                path: 'vehicles-enquiry',
                loadComponent: () => import('../vehicle-management/vehicles-enquiry/vehicles-enquiry.component').then(m => m.VehiclesEnquiryComponent),
                data: {
                    title: 'Vehicles Enquiry'
                }
            },
            {
                path: 'transport-vehicle',
                loadComponent: () => import('../vehicle-management/transport-vehicle/transport-vehicle.component').then(m => m.TransportVehicleComponent),
                data: {
                    title: 'Transport Vehicle'
                }
            }
        ]
    }
];
