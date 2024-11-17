import { Routes } from '@angular/router';
import { isAuthenticatedguard } from './auth/guards/isAuthenticated.guard';
import { NonAuthenticatedGuard } from './auth/guards/is-nonAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [NonAuthenticatedGuard],
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
        canActivate: [NonAuthenticatedGuard],
      },
      {
        path: 'register',
        title: 'Registro',
        loadComponent: () =>
          import('./auth/pages/register-page/register-page.component').then(
            (m) => m.RegisterPageComponent
          ),
        canActivate: [NonAuthenticatedGuard],
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./tareas/dashboard/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
    canActivate: [isAuthenticatedguard],
    children: [
      {
        path: 'tasks',
        title: 'Tasks',
        loadComponent: () =>
          import('./tareas/pages/principal-page/principal-page.component').then(
            (m) => m.PrincipalPageComponent
          ),
        canActivate: [isAuthenticatedguard],
      },
      {
        path: 'tasks/new',
        loadComponent: () =>
          import('./tareas/pages/form-task/form-task.component').then(
            (m) => m.FormTaskComponent
          ),
        canActivate: [isAuthenticatedguard],
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () =>
          import('./tareas/pages/form-task/form-task.component').then(
            (m) => m.FormTaskComponent
          ),
        canActivate: [isAuthenticatedguard],
      },
      {
        path: 'stats',
        title: 'Stats',
        loadComponent: () =>
          import(
            './tareas/pages/stadistics-page/stadistics-page.component'
          ).then((m) => m.StadisticsPageComponent),
        canActivate: [isAuthenticatedguard],
      },
      {
        path: 'sharedTasks',
        title: 'Shared Tasks',
        loadComponent: () =>
          import('./tareas/pages/shared-page/shared-page.component').then(
            (m) => m.SharedPageComponent
          ),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
