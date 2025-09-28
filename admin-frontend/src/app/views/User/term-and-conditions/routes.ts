import { Routes } from '@angular/router';
import { TermAndConditionsComponent } from './term-and-conditions.component';

export const routes: Routes = [
    {
        path: '',
        component: TermAndConditionsComponent,
        data: {
            title: 'TermAndConditions'
        }
    }
];
