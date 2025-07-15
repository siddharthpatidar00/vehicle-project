import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Components',
    title: true
  },
    {
    name: 'Control Panel',
    url: '/control-panel',
    iconComponent: { name: 'cilSettings' },
    children: [
      {
        name: 'Category',
        url: '/control-panel/vehicle-category',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Brand',
        url: '/control-panel/brand',
        icon: 'nav-icon-bullet'
      }
    ]
  },
    {
    name: 'User Management',
    url: '/user-management',
    iconComponent: { name: 'cilUserFollow' },
    children: [
      {
        name: 'User',
        url: '/user-management/user-management',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Staff',
        url: '/user-management/staff-management',
        icon: 'nav-icon-bullet'
      }
    ]
  },
    {
    name: 'Vehicles Management',
    url: '/vehicles-management',
    iconComponent: { name: 'cilTruck' },
    children: [
      {
        name: 'Vehicles',
        url: '/vehicles-management/vehicles',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vehicles Enquiry',
        url: '/vehicles-management/vehicles-enquiry',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Transport Vehicle',
        url: '/vehicles-management/transport-vehicle',
        icon: 'nav-icon-bullet'
      }
    ]
  },

  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // }
];
