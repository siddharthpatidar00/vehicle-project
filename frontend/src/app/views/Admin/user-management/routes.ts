import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'User Management'
        },
        children: [
            {
                path: '',
                redirectTo: 'staff-management',
                pathMatch: 'full'
            },
            {
                path: 'staff-management',
                loadComponent: () => import('../user-management/staff-management/staff-management.component').then(m => m.StaffManagementComponent),
                data: {
                    title: 'Staff'
                }
            },
                {
                path: 'user-management',
                loadComponent: () => import('../user-management/user-management/user-management.component').then(m => m.UserManagementComponent),
                data: {
                    title: 'User'
                }
            }
        ]
    }
];
