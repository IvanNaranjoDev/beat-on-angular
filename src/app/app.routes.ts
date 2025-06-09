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
import { SoundComponent } from './features/sound/sound.component';
import { SoundFormComponent } from './features/sound-form/sound-form.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { EmailFormComponent } from './features/email-form/email-form.component';
import { SequencerComponent } from './features/sequencer/sequencer.component';
import { MyInstrumentalsComponent } from './features/my-instrumentals/my-instrumentals.component';
import { MySequencerComponent } from './features/my-sequencer/my-sequencer.component';
import { FavoritesComponent } from './features/favorites/favorites.component';

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
        path: 'profile', component : UserProfileComponent,
        canActivate: [authGuard],
    },
    {
        path: 'sequencer', component : SequencerComponent,
        canActivate: [authGuard],
    },
    {
        path: 'my-instrumentals', component : MyInstrumentalsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'favorites', component : FavoritesComponent,
        canActivate: [authGuard],
    },
    {
        path: 'my-sequencer/:instrumentalId', component: MySequencerComponent,
        canActivate: [authGuard,]
    },
    {
        path: 'users', component : UserComponent,
        canActivate: [authGuard],
    },
    {
        path: 'mails', component : EmailFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'categories', component : CategoryComponent,
        canActivate: [authGuard],
    },
    {
        path: 'sounds', component : SoundComponent,
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
        path: 'sound-form', component : SoundFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'forbidden', component : ForbiddenComponent
    },
    {
        path: '**', component : Error404Component
    }
];