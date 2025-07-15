// views/contact-us/routes.ts
import { Routes } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';

export const routes: Routes = [
    {
        path: '',
        component: ContactUsComponent,
        data: {
            title: 'Contact Us'
        }
    }
];
