import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Funcionarios } from './pages/funcionarios/funcionarios';
import { authGuard } from './guards/authGuard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'funcionarios', component: Funcionarios, canActivate: [authGuard]},

];
