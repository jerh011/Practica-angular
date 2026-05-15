import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@core/layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'catalogs',
        pathMatch: 'full',
      },
      {
        path: 'catalogs',
        loadChildren: () => import('@catalogs/catalogs.routes').then((m) => m.catalogRoutes),
      },
    ],
  },
];