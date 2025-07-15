import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginGuard } from './guards/auth/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    canActivate: [AuthGuard],  // protect entire layout & child routes
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: { title: 'Home' },
    children: [
      { path: 'dashboard', loadChildren: () => import('./views/dashboard/routes').then(m => m.routes) },
      { path: 'user-management', loadChildren: () => import('./views/user-management/routes').then(m => m.routes) },
      { path: 'icons', loadChildren: () => import('./views/icons/routes').then(m => m.routes) },
      { path: 'pages', loadChildren: () => import('./views/pages/routes').then(m => m.routes) },
      { path: 'control-panel', loadChildren: () => import('./views/control-panel/routes').then(m => m.routes) },
      { path: 'vehicles-management', loadChildren: () => import('./views/vehicle-management/routes').then(m => m.routes) }
    ]
  },

  // login route is public but blocked by LoginGuard
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login Page' }
  },

  { path: '404', loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page 404' } },
  { path: '500', loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component), data: { title: 'Page 500' } },
  { path: 'profile', loadComponent: () => import('./views/pages/profile/profile.component').then(m => m.ProfileComponent), data: { title: 'Profile Page' } },

  // wildcard fallback
  { path: '**', redirectTo: '404' }
];
