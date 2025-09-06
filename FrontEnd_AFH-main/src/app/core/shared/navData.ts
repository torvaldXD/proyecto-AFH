// export const navData=[
//     {routerLink:'',icon:'bx bxs-shopping-bag-alt',description:'My Store',status:Boolean},
//     {routerLink:'',icon:'bx bxs-doughnut-chart',description:'Analytics',status:Boolean},
//     {routerLink:'',icon:'bx bxs-message-dots',description:'Message',status:Boolean},
//     {routerLink:'',icon:'bx bxs-group',description:'Team',status:Boolean},

// ];

export declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    condition?: any;
  }

// export const MenuItem= [
//       {
//         path: '/home',
//         title: 'Inicio',
//         icon: "bx bxs-dashboard",
//         condition: 'userLocalStorage',
//       },
//       {
//         path: '/staff',
//         title: 'Usuarios',
//         icon: "bx bxs-group",
//         condition: "userLocalStorage.area === 'GERENCIA'",
//       },

//       {
//         path: '/quotes',
//         title: 'Cotizaciones',
//         icon: 'bx bxs-file',
//         condition: "userLocalStorage.area === 'GERENCIA' || userLocalStorage.area === 'COMERCIAL'",
//       },

//       {
//         path: '/tools',
//         title: 'Herramientas' ,
//         icon: "bx bxs-wrench",
//         condition: "userLocalStorage.area === 'GERENCIA' || userLocalStorage.area === 'LOGISTICA'",
//       },
//       {
//         path: '/employes',
//         title: 'Empleados',
//         icon: "bx bxs-user-account",
//         condition: "userLocalStorage.area === 'GERENCIA'",
//       },
//       {
//         path: '/clients',
//         title: 'Clientes',
//         icon: "bx bxs-user-detail",
//         condition: "userLocalStorage.area === 'GERENCIA'",
//       },
//       {
//         path: '/supplies',
//         title: 'Suministros',
//         icon: "bx bxs-package",
//         condition: "userLocalStorage.area === 'GERENCIA' || userLocalStorage.area === 'LOGISTICA'",
//       },

//     ];

export const MenuItems1 = [
      {
        path: '/home',
        title: 'Inicio',
        icon: "bx bxs-dashboard",
        condition: "this.userLocalStorage",
      },
      {
        path: '/staff',
        title: 'Usuarios',
        icon: "bx bxs-group",
        condition: "this.userLocalStorage.area === 'GERENCIA'",
      },

      {
        path: '/quotes',
        title: 'Cotizaciones',
        icon: 'bx bxs-file',
        condition: "this.userLocalStorage.area === 'GERENCIA' || this.userLocalStorage.area === 'COMERCIAL'",
      },

      {
        path: '/tools',
        title: 'Herramientas' ,
        icon: "bx bxs-wrench",
        condition: "this.userLocalStorage.area === 'GERENCIA' || this.userLocalStorage.area === 'LOGISTICA'",
      },
      {
        path: '/employes',
        title: 'Empleados',
        icon: "bx bxs-user-account",
        condition: "this.storageService.getCurrentUser().area === 'GERENCIA'",
      },
      {
        path: '/clients',
        title: 'Clientes',
        icon: "bx bxs-user-detail",
        condition: "this.storageService.getCurrentUser().area === 'GERENCIA'",
      },
      {
        path: '/supplies',
        title: 'Suministros',
        icon: "bx bxs-package",
        condition: "this.storageService.getCurrentUser().area === 'GERENCIA' || this.storageService.getCurrentUser().area === 'LOGISTICA'",
      },

    ];