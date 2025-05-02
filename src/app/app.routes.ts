import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component'; 
import { Error404Component } from './shared/error404/error404.component';
import { UserComponent } from './features/user/user.component';
import { UserFormComponent } from './features/user-form/user-form.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', component : HomeComponent
    },
    {
        path: 'login', component : LoginComponent 
    },
    {
        path: 'users', component : UserComponent,
        canActivate: [authGuard],
    },
    {
        path: 'user-form', component : UserFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'forbidden', component : ForbiddenComponent
    },
    {
        path: '**', component : Error404Component
    }
];