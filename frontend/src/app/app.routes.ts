import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginGuard } from '../guards/userAuth/login.guard'
import { RegisterGuard } from '../guards/userAuth/register.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    // data: {
    //   title: 'Home'
    // },
    children: [
      {
        path: 'home',
        loadChildren: () => import('./views/home/routes').then((m) => m.routes)
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./views/contact-us/routes').then((m) => m.routes)
      },
      {
        path: 'about',
        loadChildren: () => import('./views/about/routes').then((m) => m.routes)
      },
      {
        path: 'faq',
        loadChildren: () => import('./views/faq/routes').then((m) => m.routes)
      },
      {
        path: 'vehicle-detail',
        loadChildren: () => import('./views/vehicle-details/routes').then((m) => m.routes)
      },
      {
        path: 'vehicles-listing',
        loadChildren: () => import('./views/vehicle-listing/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    canActivate: [RegisterGuard],
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'home' }
];
