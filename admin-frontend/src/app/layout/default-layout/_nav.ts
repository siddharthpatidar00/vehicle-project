import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/admin-dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Control Panel',
    url: '/admin-control-panel',
    iconComponent: { name: 'cilSettings' },
    children: [
      {
        name: 'Categories',
        url: '/admin-control-panel/vehicle-category',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Brands',
        url: '/admin-control-panel/brand',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'User Management',
    url: '/admin-user-management',
    iconComponent: { name: 'cilUserFollow' },
    children: [
      {
        name: 'Users',
        url: '/admin-user-management/user-management',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Staffs',
        url: '/admin-user-management/staff-management',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Vehicles Management',
    url: '/admin-vehicles-management',
    iconComponent: { name: 'cilTruck' },
    children: [
      {
        name: 'Vehicles List',
        url: '/admin-vehicles-management/vehicles',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vehicle Inquiries',
        url: '/admin-vehicles-management/vehicles-enquiry',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Transport Inquiries',
        url: '/admin-vehicles-management/transport-vehicle',
        icon: 'nav-icon-bullet'
      }
    ]
  },

  {
    name: 'Loan & Insurance',
    url: '/admin-bank-management',
    iconComponent: { name: 'cilBank' },
    children: [
      {
        name: 'Loan',
        url: '/admin-bank-management/loan',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Insurance',
        url: '/admin-bank-management/insurance',
        icon: 'nav-icon-bullet'
      }
    ]
  }
  ,
  {
    name: 'Others',
    url: '/admin-others',
    iconComponent: { name: 'cilSpreadsheet' },
    children: [
      {
        name: 'Happy Customer',
        url: '/admin-others/happy-customer',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Contact Us',
        url: '/admin-others/contact-us',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Advertisement',
        url : '/admin-others/advertisement',
        icon : 'nav-icon-bullet'
      }
    ]
  }
];
