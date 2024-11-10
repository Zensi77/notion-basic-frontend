import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'register',
        title: 'Registro',
        loadComponent: () =>
          import('./auth/pages/register-page/register-page.component').then(
            (m) => m.RegisterPageComponent
          ),
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./tareas/dashboard/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
    children: [
      {
        path: 'tasks',
        title: 'Tasks',
        loadComponent: () =>
          import('./tareas/pages/principal-page/principal-page.component').then(
            (m) => m.PrincipalPageComponent
          ),
      },
      {
        path: 'tasks/new',
        loadComponent: () =>
          import('./tareas/pages/form-task/form-task.component').then(
            (m) => m.FormTaskComponent
          ),
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () =>
          import('./tareas/pages/form-task/form-task.component').then(
            (m) => m.FormTaskComponent
          ),
      },
      {
        path: 'stats',
        title: 'Stats',
        loadComponent: () =>
          import(
            './tareas/pages/stadistics-page/stadistics-page.component'
          ).then((m) => m.StadisticsPageComponent),
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
