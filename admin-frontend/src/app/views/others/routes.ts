import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Others'
        },
        children: [
            {
                path: '',
                redirectTo: 'happy-customer',
                pathMatch: 'full'
            },
            {
                path: 'happy-customer',
                loadComponent: () => import('../others/happy-customer/happy-customer.component').then(m => m.HappyCustomerComponent),
                data: {
                    title: 'Happy Customer'
                }
            },
            {
                path: 'contact-us',
                loadComponent: () => import('../others/contact-us/contact-us.component').then(m => m.ContactUsComponent),
                data: {
                    title: 'Contact Us'
                }
            },
            {
                path: 'advertisement',
                loadComponent: () => import('../others/advertisement/advertisement.component').then(m => m.AdvertisementComponent),
                data: {
                    title: 'Advertisement'
                }
            }
        ]
    }
];
