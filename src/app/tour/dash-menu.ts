import { NbMenuItem } from '@nebular/theme';

export const DASH_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/dashboard',
    home: true,
  },
  {
    title: ' ',
    group: true,
  },
  {
    title: 'Rotordyn',
    icon: 'nb-power',
    link: '/rotordyn',
  },
  {
    title: 'Users',
    icon: 'nb-person',
    link: '/user',
  },
  {
    title: 'Settings',
    icon: 'nb-gear',
    link: '/setting',
  },
  {
    title: 'Reports',
    icon: 'nb-compose',
    children: [
      {
        title: 'All',
        link: '/reports/all',
      },
      {
        title: 'New',
        link: '/reports/new',
      }
    ]
  },
  {
    title: 'Help',
    icon: 'ion-help-buoy',
    link: '/dashboard',
  },
  {
    title: 'Auth',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
