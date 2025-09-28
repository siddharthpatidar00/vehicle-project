import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/adminGuards/auth.guard';
import { LoginGuard } from '../guards/adminGuards/login.guard';
import { UserLoginGuard } from '../guards/userAuth/login.guard';
import { RegisterGuard } from '../guards/userAuth/register.guard';
import { UserAuthGuard } from '../guards/userAuth/auth.guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' },

 // ---------- USER SIDE (Website) ----------
  {
    path: '',
    loadComponent: () => import('./Userlayout/default-layout').then(m => m.DefaultLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../app/views/User/home/routes').then(m => m.routes)
      },
      {
        path: 'about',
        loadChildren: () => import('../app/views/User/about/routes').then(m => m.routes)
      },
      {
        path: 'contact-us',
        loadChildren: () => import('../app/views/User/contact-us/routes').then(m => m.routes)
      },
      {
        path: 'dashboard',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('../app/views/User/dashboard/routes').then(m => m.routes)
      },
      {
        path: 'faq',
        loadChildren: () => import('../app/views/User/faq/routes').then(m => m.routes)
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () => import('../app/views/User/term-and-conditions/routes').then(m => m.routes)
      },
      {
        path: 'vehicle-detail',
        loadChildren: () => import('../app/views/User/vehicle-details/routes').then(m => m.routes)
      },
      {
        path: 'vehicles-listing',
        loadChildren: () => import('../app/views/User/vehicle-listing/routes').then(m => m.routes)
      }
    ]
  },

  // ---------- ADMIN ROUTES ----------
  {
    path: '',
    canActivate: [AuthGuard],  // Protect admin layout
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: { title: 'Admin' },
    children: [
      { path: 'admin-dashboard', loadChildren: () => import('./views/Admin/dashboard/routes').then(m => m.routes) },
      { path: 'admin-user-management', loadChildren: () => import('./views/Admin/user-management/routes').then(m => m.routes) },
      { path: 'admin-control-panel', loadChildren: () => import('./views/Admin/control-panel/routes').then(m => m.routes) },
      { path: 'admin-vehicles-management', loadChildren: () => import('./views/Admin/vehicle-management/routes').then(m => m.routes) },
      { path: 'admin-bank-management', loadChildren: () => import('./views/Admin/bank-management/routes').then(m => m.routes) },
      { path: 'admin-others', loadChildren: () => import('./views/Admin/others/routes').then(m => m.routes) }
    ]
  },

  // ---------- AUTH ROUTES ----------
  {
    path: 'admin-login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./views/Admin/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Admin Login' }
  },
  {
    path: 'login',
    canActivate: [UserLoginGuard],
    loadComponent: () => import('./views/User/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'User Login' }
  },
  {
    path: 'register',
    canActivate: [RegisterGuard],
    loadComponent: () => import('./views/User/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'User Register' }
  },

  // ---------- COMMON ROUTES ----------
  { path: '404', loadComponent: () => import('./views/Admin/pages/page404/page404.component').then(m => m.Page404Component) },
  { path: '500', loadComponent: () => import('./views/Admin/pages/page500/page500.component').then(m => m.Page500Component) },
  { path: 'profile', loadComponent: () => import('./views/Admin/pages/profile/profile.component').then(m => m.ProfileComponent) },

  // ---------- WILDCARD ----------
  { path: '**', redirectTo: '' }
];
