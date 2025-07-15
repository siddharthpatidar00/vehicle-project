import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Control Panel'
        },
        children: [
            {
                path: '',
                redirectTo: 'vehicle-category',
                pathMatch: 'full'
            },
            {
                path: 'vehicle-category',
                loadComponent: () => import('../control-panel/vehicles-category/vehicles-category.component').then(m => m.VehiclesCategoryComponent),
                data: {
                    title: 'Category'
                }
            },
                {
                path: 'brand',
                loadComponent: () => import('../control-panel/brand/brand.component').then(m => m.BrandComponent),
                data: {
                    title: 'Brand'
                }
            }
        ]
    }
];
