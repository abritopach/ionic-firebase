import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

const redirectToLogin = redirectUnauthorizedTo(['login']);

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
        ...canActivate(redirectToLogin)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'signup',
        loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
    },
    {
        path: 'reset-password',
        loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
