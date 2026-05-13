import { Routes } from '@angular/router';

export const routes: Routes = [
//   {
//     path: 'login',
//     canActivate: [guestGuard],
//     loadComponent: () => import('@auth/pages/login-page/login-page').then((m) => m.LoginPage),
//   },
//   {
//     path: 'auth',
//     canActivate: [guestGuard],
//     loadChildren: () => import('@auth/auth.routes').then((m) => m.AUTH_ROUTES),
//   },
//   {
//     path: 'activate',
//     canActivate: [guestGuard],
//     loadComponent: () =>
//       import('@auth/pages/activation-page/activation-page').then((m) => m.ActivationPage),
//   },
//   {
//     path: 'confirm-email-change',
//     canActivate: [guestGuard],
//     loadComponent: () =>
//       import('@auth/pages/confirm-email-change-page/confirm-email-change-page').then(
//         (m) => m.ConfirmEmailChangePage,
//       ),
//   },
//   {
//     path: 'reset-password',
//     canActivate: [guestGuard],
//     loadComponent: () =>
//       import('@auth/pages/reset-password-page/reset-password-page').then(
//         (m) => m.ResetPasswordPage,
//       ),
//   },
  {
    path: '',
    loadComponent: () => import('@core/layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'catalogs',
        loadChildren: () => import('@catalogs/catalogs.routes').then((m) => m.catalogRoutes),
      },
    ],
  },
];
