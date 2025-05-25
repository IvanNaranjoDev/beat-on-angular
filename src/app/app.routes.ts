import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component'; 
import { Error404Component } from './shared/error404/error404.component';
import { UserComponent } from './features/user/user.component';
import { UserFormComponent } from './features/user-form/user-form.component';
import { authGuard } from './core/guards/auth.guard';
import { CategoryComponent } from './features/category/category.component';
import { CategoryFormComponent } from './features/category-form/category-form.component';
import { RegisterComponent } from './features/register/register.component';

export const routes: Routes = [
    {
        path: '', component : HomeComponent
    },
    {
        path: 'login', component : LoginComponent 
    },
    {
        path: 'register', component : RegisterComponent 
    },
    {
        path: 'users', component : UserComponent,
        canActivate: [authGuard],
    },
    {
        path: 'categories', component : CategoryComponent,
        canActivate: [authGuard],
    },
    {
        path: 'user-form', component : UserFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'category-form', component : CategoryFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'forbidden', component : ForbiddenComponent
    },
    {
        path: '**', component : Error404Component
    }
];