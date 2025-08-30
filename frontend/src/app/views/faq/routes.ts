import { Routes } from '@angular/router';
import { FaqComponent } from './faq.component';

export const routes: Routes = [
    {
        path: '',
        component: FaqComponent,
        data: {
            title: 'FAQ'
        }
    }
];
