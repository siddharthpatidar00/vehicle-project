import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  // {
  //   name: 'Components',
  //   title: true
  // },
  {
    name: 'Control Panel',
    url: '/control-panel',
    iconComponent: { name: 'cilSettings' },
    children: [
      {
        name: 'Categories',
        url: '/control-panel/vehicle-category',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Brands',
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
        name: 'Users',
        url: '/user-management/user-management',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Staffs',
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
        name: 'Vehicles List',
        url: '/vehicles-management/vehicles',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vehicle Inquiries',
        url: '/vehicles-management/vehicles-enquiry',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Transport Inquiries',
        url: '/vehicles-management/transport-vehicle',
        icon: 'nav-icon-bullet'
      }
    ]
  },

  {
    name: 'Loan & Insurance',
    url: '/bank-management',
    iconComponent: { name: 'cilBank' },
    children: [
      {
        name: 'Loan',
        url: '/bank-management/loan',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Insurance',
        url: '/bank-management/insurance',
        icon: 'nav-icon-bullet'
      }
    ]
  }
  ,
  {
    name: 'Others',
    url: '/others',
    iconComponent: { name: 'cilSpreadsheet' },
    children: [
      {
        name: 'Happy Customer',
        url: '/others/happy-customer',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Contact Us',
        url: '/others/contact-us',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Advertisement',
        url : '/others/advertisement',
        icon : 'nav-icon-bullet'
      }
    ]
  }
];
