import { PATH } from "../core/enum/path.enum";
import { MenuInfoInterface } from "../core/interface/menu_info.interface";

export const MenuRoutes: MenuInfoInterface[] = [

    {
        path: PATH.HOME,
        title: 'Home',
        icon: 'fa-solid fa-house',
        classCss: '',
        subMenu: [],
      },
      {
        path: PATH.USUARIO,
        title: 'Usuario',
        icon: '',
        classCss: '',
        subMenu: [],
      },
      {
        path: PATH.MATERIAS,
        title: 'Materias',
        icon: '',
        classCss: '',
        subMenu: [],
      },
      {
        path: PATH.PENSUM,
        title: 'Pensum',
        icon: '',
        classCss: '',
        subMenu: [],
      },

]