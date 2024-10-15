import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PATH } from './core/enum/path.enum';
import { InicioComponent } from './page/inicio/inicio.component';
import { UsuariosComponent } from './page/usuarios/usuarios.component';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent
    },
    {
        path: PATH.HOME,
        title: 'Inicio',
        // canActivate: [AuthGuard],
        children: [
            {
                path: '',
                title: 'Home',
                component: InicioComponent
            },
            {
                path: 'usuario',
                title: 'Usuarios',
                component: UsuariosComponent
            },
        ]
    },
    
    // {
    //     path: 'login',
    //     component: LoginComponent
    // },
    // {
    //     path: PATH.HOME,
    //     title: 'Home',
    //     component: InicioComponent,
    // },
    // {
    //     path: PATH.USUARIO,
    //     title: 'Usuarios',
    //     component: UsuariosComponent,
    // }
];
