import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { InicioComponent } from './page/inicio/inicio.component';
import { UsuariosComponent } from './page/usuarios/usuarios.component';
import { authGuard } from './guards/auth.guard'; // Asegúrate de usar la ruta correcta
import { PATH } from './core/enum/path.enum';
import { QuienesSomosComponent } from './page/quienes-somos/quienes-somos.component';
import { MateriasComponent } from './page/materias/materias.component';
import { PensumsComponent } from './page/pensums/pensums.component';
import { PensumDetalleComponent } from './page/pensum-detalle/pensum-detalle.component';

export const routes: Routes = [
    {
        path: PATH.LOGIN,
        title: 'Login',
        component: LoginComponent,
    },
    {
        path: PATH.HOME,
        title: 'Inicio',
        canActivate: [authGuard], // Aplica el guard a HOME
        children: [
            {
                path: '',
                title: 'Home',
                component: InicioComponent,
                canActivate: [authGuard],
            },
            {
                path: PATH.USUARIO,
                title: 'Usuarios',
                component: UsuariosComponent,
                canActivate: [authGuard],
            },
            {
                path: PATH.MATERIAS,
                title: 'Materias',
                component: MateriasComponent,
                canActivate: [authGuard],
            },
            {
                path: PATH.PENSUM,
                title: 'Pensum',
                component: PensumsComponent,
                canActivate: [authGuard],
            },
            {
                path: PATH.QUIENESOMOS,
                title: 'Quienes somos',
                component: QuienesSomosComponent,
                canActivate: [authGuard],
            },
            {
                path: PATH.PENSUM_DETALLE,
                title: 'Pensum detallado',
                component: PensumDetalleComponent,
                canActivate: [authGuard],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '', // Ruta por defecto a Login si no se encuentra la ruta
    },
];
