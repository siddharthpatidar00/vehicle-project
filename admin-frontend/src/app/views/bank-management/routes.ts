import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Loan & Insurance'
        },
        children: [
            {
                path: '',
                redirectTo: 'loan',
                pathMatch: 'full'
            },
            {
                path: 'loan',
                loadComponent: () => import('../bank-management/loan/loan.component').then(m => m.LoanComponent),
                data: {
                    title: 'Loan'
                }
            },
                {
                path: 'insurance',
                loadComponent: () => import('../bank-management/insurance/insurance.component').then(m => m.InsuranceComponent),
                data: {
                    title: 'Insurance'
                }
            }
        ]
    }
];
